'use client';

import { useState, useEffect, useRef } from 'react';
import supabase from '../../lib/supabase';
import './admin.css';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMsg, setLoginMsg] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeLeft, setLockTimeLeft] = useState(0);

  // upload state
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadMsg, setUploadMsg] = useState('');
  const fileInputRef = useRef(null);

  // gallery state
  const [gallery, setGallery] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  // session and lockout management
  useEffect(() => {
    // check lockout
    const lockUntil = parseInt(localStorage.getItem('lockUntil')) || 0;

    if (Date.now() < lockUntil) {
      setIsLocked(true);

      const remaining = Math.ceil((lockUntil - Date.now()) / 1000);
      setLockTimeLeft(remaining);
    }

    let inactivityTimer;

    const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 mins
    const MAX_SESSION_AGE = 10 * 60 * 1000; // 10 mins

    // auto logout timer reset
    const resetTimer = () => {
      if (!session) return;

      clearTimeout(inactivityTimer);

      inactivityTimer = setTimeout(() => {
        alert('Logged out due to inactivity.');
        handleLogout();
      }, INACTIVITY_LIMIT);
    };

    // check session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        const sessionStart =
          parseInt(localStorage.getItem('sessionStart')) || 0;

        const now = Date.now();

        // hard session expiry
        if (sessionStart && now - sessionStart > MAX_SESSION_AGE) {
          handleLogout();
        } else {
          if (!sessionStart) {
            localStorage.setItem(
              'sessionStart',
              Date.now().toString()
            );
          }

          setSession(data.session);
          loadGallery();

          // start inactivity timer
          resetTimer();
        }
      }

      setLoadingSession(false);
    });

    // auto logout timer events
    const events = [
      'click',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
    ];

    events.forEach((evt) =>
      document.addEventListener(evt, resetTimer)
    );

    return () => {
      clearTimeout(inactivityTimer);

      events.forEach((evt) =>
        document.removeEventListener(evt, resetTimer)
      );
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isLocked && lockTimeLeft > 0) {
      interval = setInterval(() => {
        setLockTimeLeft((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            localStorage.removeItem('lockUntil');
            localStorage.removeItem('failedAttempts');
            setLoginMsg('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimeLeft]);

  // handlers
  const handleLogin = async () => {
    if (isLocked) return;
    if (!email || !password) {
      setLoginMsg('Please enter both email and password.');
      setTimeout(() => setLoginMsg(''), 3000);
      return;
    }

    setLoginMsg('Logging in...');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      let attempts = parseInt(localStorage.getItem('failedAttempts')) || 0;
      attempts++;
      localStorage.setItem('failedAttempts', attempts.toString());
      setLoginMsg(`Login failed: ${error.message}`);

      if (attempts >= 3) {
        const lockTime = Date.now() + 60 * 1000;
        localStorage.setItem('lockUntil', lockTime.toString());
        setIsLocked(true);
        setLockTimeLeft(60);
      }
    } else {
      localStorage.removeItem('failedAttempts');
      localStorage.removeItem('lockUntil');
      localStorage.setItem('sessionStart', Date.now().toString());
      setSession(data.session);
      loadGallery();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('sessionStart');
    setSession(null);
    setGallery([]);
    setEmail('');
    setPassword('');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      clearPreview();
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const clearPreview = () => {
    setFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const stripImageMetadata = async (originalFile) => {
    const img = new Image();
    img.src = URL.createObjectURL(originalFile);
    await img.decode();

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    return new File([blob], `image-${Date.now()}.jpg`, { type: 'image/jpeg' });
  };

  const handleUpload = async () => {
    if (!file || !title) {
      setUploadMsg('Image and title required.');
      setTimeout(() => setUploadMsg(''), 3000);
      return;
    }

    setUploadMsg('Uploading...');
    try {
      const cleanFile = await stripImageMetadata(file);
      const filePath = `portraits/${Date.now()}-${cleanFile.name}`;

      const { error: storageError } = await supabase.storage.from('gallery').upload(filePath, cleanFile);
      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('portraits').insert([{ title, image_url: urlData.publicUrl }]);
      if (dbError) throw dbError;

      setUploadMsg('Image upload successful!');
      setTimeout(() => setUploadMsg(''), 3000);

      clearPreview();
      setTitle('');
      loadGallery();
    } catch (err) {
      console.error(err);
      setUploadMsg('Upload failed.');
    }
  };

  const loadGallery = async () => {
    try {
      const { data, error } = await supabase.from('portraits').select('*').order('id', { ascending: false });
      if (error) throw error;
      // Shuffle logic
      const shuffled = data.sort(() => Math.random() - 0.5);
      setGallery(shuffled);
      setSelectedImages([]);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelectImage = (id) => {
    setSelectedImages((prev) => (prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id]));
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Delete ${selectedImages.length} image(s)?`)) return;

    for (const id of selectedImages) {
      const item = gallery.find((g) => g.id === id);
      if (item) {
        const fileName = item.image_url.split('/').pop();
        const filePath = `portraits/${fileName}`;
        await supabase.storage.from('gallery').remove([filePath]);
        await supabase.from('portraits').delete().eq('id', id);
      }
    }
    loadGallery();
  };

  if (loadingSession) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div className="admin-wrapper">
      {!session ? (
        <section className="card">
          <h1 className="brand">Portraiture Admin</h1>
          <div className="user-input">
            <div className="form-row">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="form-row">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <button
              className="btn"
              style={{ width: '100%', backgroundColor: '#5a5a5a' }}
              onClick={handleLogin}
              disabled={isLocked}
            >
              {isLocked ? `Locked (${lockTimeLeft}s)` : 'Log in'}
            </button>
          </div>
          <p className="muted" style={{ color: isLocked ? '#ef4444' : 'inherit' }}>
            {loginMsg}
          </p>
        </section>
      ) : (
        <>
          <section className="card" style={{ paddingTop: 0 }}>
            <h2 className="upload">Image Upload Portal</h2>
            <div className="form-row">
              <input type="text" placeholder="Image title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="form-row">
              <label htmlFor="image" className="file-label">
                <span>Choose Image</span>
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              {file && (
                <button type="button" className="btn outline" id="clear-file" onClick={clearPreview}>
                  Cancel
                </button>
              )}
            </div>

            {previewUrl && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <img src={previewUrl} alt="Preview" style={{ maxWidth: '160px', borderRadius: '10px' }} />
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{file?.name}</div>
              </div>
            )}

            <div className="form-row action-row">
              <button className="btn primary" onClick={handleUpload}>
                Upload
              </button>
              <button className="btn outline" onClick={handleLogout}>
                Logout
              </button>
            </div>
            <p className="muted">{uploadMsg}</p>
          </section>

          <section className="card gallery-card">
            <div className="gallery-header">
              <h2>G A L L E R Y</h2>
              <button
                className="danger-btn"
                disabled={selectedImages.length === 0}
                onClick={handleDeleteSelected}
              >
                Delete Selected
              </button>
            </div>
            <div className="grid">
              {gallery.length === 0 ? (
                <p>No images found.</p>
              ) : (
                gallery.map((item) => (
                  <GalleryItem
                    key={item.id}
                    item={item}
                    isSelected={selectedImages.includes(item.id)}
                    onSelect={() => toggleSelectImage(item.id)}
                    onReload={loadGallery}
                  />
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

// sub-component for individual gallery cards to handle their own edit/delete state
function GalleryItem({ item, isSelected, onSelect, onReload }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);

  const handleSave = async () => {
    if (!editTitle.trim()) return alert('Title cannot be empty.');
    try {
      await supabase.from('portraits').update({ title: editTitle }).eq('id', item.id);
      setIsEditing(false);
      onReload(); // refresh parent gallery state
    } catch (err) {
      console.error(err);
      alert('Failed to update title.');
    }
  };

  return (
    <div className="portrait-card">
      <label className="select-box">
        <input type="checkbox" className="select-checkbox" checked={isSelected} onChange={onSelect} />
      </label>
      <img src={item.image_url} alt={item.title} />

      {isEditing ? (
        <div style={{ width: '100%', marginBottom: '10px' }}>
          <input
            type="text"
            className="edit-input"
            style={{ width: '100%', boxSizing: 'border-box' }}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
        </div>
      ) : (
        <h3>{item.title}</h3>
      )}

      <div className="card-actions">
        {isEditing ? (
          <>
            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Rename</button>
        )}
      </div>
    </div>
  );
}
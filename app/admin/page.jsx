'use client';

import { useState, useEffect, useRef } from 'react';
import supabase from '../../lib/supabaseClient';
import './admin.css';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Login & Lockout State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMsg, setLoginMsg] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeLeft, setLockTimeLeft] = useState(0);

  // Upload Portal State
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadMsg, setUploadMsg] = useState('');
  const fileInputRef = useRef(null);

  // Gallery State
  const [gallery, setGallery] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  // --- 1. Session & Auto-Logout Logic ---
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        loadGallery();
      }
      setLoadingSession(false);
    };

    checkSession();

    // Check Lockout on load
    const lockUntil = parseInt(localStorage.getItem('lockUntil')) || 0;
    if (Date.now() < lockUntil) {
      setIsLocked(true);
      setLockTimeLeft(Math.ceil((lockUntil - Date.now()) / 1000));
    }
  }, []);

  // Lockout Timer
  useEffect(() => {
    let interval;
    if (isLocked && lockTimeLeft > 0) {
      interval = setInterval(() => {
        setLockTimeLeft((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            localStorage.removeItem('lockUntil');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimeLeft]);

  // --- 2. Auth Handlers ---
  const handleLogin = async () => {
    if (isLocked) return;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      let attempts = (parseInt(localStorage.getItem('failedAttempts')) || 0) + 1;
      localStorage.setItem('failedAttempts', attempts);
      setLoginMsg(`Login failed: ${error.message}`);
      if (attempts >= 3) {
        const lockUntil = Date.now() + 60000;
        localStorage.setItem('lockUntil', lockUntil);
        setIsLocked(true);
        setLockTimeLeft(60);
      }
    } else {
      localStorage.removeItem('failedAttempts');
      setSession(data.session);
      loadGallery();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setGallery([]);
  };

  // --- 3. Upload & Image Logic ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (previewUrl) URL.revokeObjectURL(previewUrl); // Clean up memory
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const clearPreview = () => {
    setFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const stripMetadata = async (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          resolve(new File([blob], `img-${Date.now()}.jpg`, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.9);
      };
    });
  };

  const handleUpload = async () => {
    if (!file || !title) return setUploadMsg('Title and image required.');
    setUploadMsg('Uploading...');

    try {
      const cleanFile = await stripMetadata(file);
      const filePath = `portraits/${Date.now()}-${cleanFile.name}`;
      
      const { error: storageError } = await supabase.storage.from('gallery').upload(filePath, cleanFile);
      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('portraits').insert([
        { title, image_url: urlData.publicUrl }
      ]);
      if (dbError) throw dbError;

      setUploadMsg('Success!');
      setTitle('');
      clearPreview();
      loadGallery();
    } catch (err) {
      setUploadMsg('Upload failed.');
    }
  };

  // --- 4. Gallery Logic ---
  const loadGallery = async () => {
    const { data } = await supabase.from('portraits').select('*').order('id', { ascending: false });
    setGallery(data || []);
  };

  const deleteSelected = async () => {
    if (!confirm(`Delete ${selectedImages.length} images?`)) return;
    for (const id of selectedImages) {
      const item = gallery.find(g => g.id === id);
      const fileName = item.image_url.split('/').pop();
      await supabase.storage.from('gallery').remove([`portraits/${fileName}`]);
      await supabase.from('portraits').delete().eq('id', id);
    }
    setSelectedImages([]);
    loadGallery();
  };

  if (loadingSession) return <div className="admin-wrapper">Loading Admin Portal...</div>;

  return (
    <div className="admin-wrapper">
      {!session ? (
        /* LOGIN CARD */
        <section className="card">
          <h1 className="brand">Portraiture Admin</h1>
          <div className="user-input">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="form-row" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="form-row" />
          </div>
          <button className="btn" onClick={handleLogin} disabled={isLocked} style={{ width: '100%' }}>
            {isLocked ? `Locked (${lockTimeLeft}s)` : 'Log in'}
          </button>
          <p className="muted">{loginMsg}</p>
        </section>
      ) : (
        <>
          {/* RESTYLED UPLOAD PORTAL CARD */}
          <section className="card upload-portal-card" style={{ paddingTop: 0 }}>
            <div className="portal-header-gradient">
              <h2>Image Upload Portal</h2>
              <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '8px' }}>Add a new portrait to the gallery</p>
            </div>

            <div style={{ padding: '0 10px' }}>
              <div className="portal-input-group">
                <input type="text" placeholder="Image title..." value={title} onChange={e => setTitle(e.target.value)} />
              </div>

              {!previewUrl ? (
                <div 
                  className="drop-zone"
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('active'); }}
                  onDragLeave={e => e.currentTarget.classList.remove('active')}
                  onDrop={e => {
                    e.preventDefault();
                    setFile(e.dataTransfer.files[0]);
                    setPreviewUrl(URL.createObjectURL(e.dataTransfer.files[0]));
                  }}
                >
                  <div className="drop-zone-text">
                    <p><strong>Click to upload</strong> or drag and drop</p>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                </div>
              ) : (
                <div className="preview-thumbnail-wrapper">
                  <img src={previewUrl} alt="Preview" style={{ width: '100%' }} />
                  <button className="remove-preview-btn" onClick={clearPreview}>&times;</button>
                </div>
              )}

              <button className="btn upload-action-btn" onClick={handleUpload} style={{ marginTop: '20px' }}>
                Complete Upload
              </button>
              <button className="btn outline" onClick={handleLogout} style={{ width: '100%', border: 'none', marginTop: '10px' }}>
                Sign Out
              </button>
              {uploadMsg && <p className="muted" style={{ textAlign: 'center' }}>{uploadMsg}</p>}
            </div>
          </section>

          {/* GALLERY CARD */}
          <section className="card gallery-card">
            <div className="gallery-header">
              <h2>G A L L E R Y</h2>
              <button className="danger-btn" onClick={deleteSelected} disabled={selectedImages.length === 0}>
                Delete Selected
              </button>
            </div>
            <div className="grid">
              {gallery.map(item => (
                <div key={item.id} className="portrait-card">
                  <label className="select-box">
                    <input 
                      type="checkbox" 
                      checked={selectedImages.includes(item.id)} 
                      onChange={() => setSelectedImages(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id])} 
                    />
                  </label>
                  <img src={item.image_url} alt={item.title} />
                  <h3>{item.title}</h3>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
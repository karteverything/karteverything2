import { useEffect, useMemo, useRef, useState } from "react";

import supabase from "../../lib/supabase";

import {
    getGallery,
    uploadImage,
    renameImage,
    deleteImages,
} from "../../lib/api";

import "./admin.css";


const SESSION_LIMIT = 10 * 60 * 1000;
const INACTIVITY_LIMIT = 10 * 60 * 1000;


function formatBytes(bytes) {
    if (!bytes || bytes <= 0) {
        return "0 B";
    }

    const units = ["B", "KB", "MB", "GB", "TB"];
    const index = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    return `${(
        bytes / Math.pow(1024, index)
    ).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}


function formatDate(dateString) {
    if (!dateString) {
        return "—";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
}


function formatRelativeDate(dateString) {
    if (!dateString) {
        return "—";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    const now = new Date();
    const diff = now - date;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < minute) {
        return "Just now";
    }

    if (diff < hour) {
        return `${Math.floor(diff / minute)}m ago`;
    }

    if (diff < day) {
        return `${Math.floor(diff / hour)}h ago`;
    }

    if (diff < 7 * day) {
        return `${Math.floor(diff / day)}d ago`;
    }

    return formatDate(dateString);
}


function Icon({ name, size = 20 }) {
    const common = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
    };

    switch (name) {
        case "grid":
            return (
                <svg {...common}>
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
            );

        case "image":
            return (
                <svg {...common}>
                    <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                    />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                </svg>
            );

        case "upload":
            return (
                <svg {...common}>
                    <path d="M12 16V4" />
                    <path d="m7 9 5-5 5 5" />
                    <path d="M5 20h14" />
                </svg>
            );

        case "settings":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.5 1.5-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.12v-.4a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.5-1.5.06-.06A1.7 1.7 0 0 0 9.2 15a1.7 1.7 0 0 0-1.56-1.03H7.2v-2.12h.4A1.7 1.7 0 0 0 9.16 10.8a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.5-1.5.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V5h2.12v.4a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.5 1.5-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.03h.4v2.12h-.4A1.7 1.7 0 0 0 19.4 15Z" />
                </svg>
            );

        case "log-out":
            return (
                <svg {...common}>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <path d="m16 17 5-5-5-5" />
                    <path d="M21 12H9" />
                </svg>
            );

        case "search":
            return (
                <svg {...common}>
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                </svg>
            );

        case "menu":
            return (
                <svg {...common}>
                    <path d="M4 6h16" />
                    <path d="M4 12h16" />
                    <path d="M4 18h16" />
                </svg>
            );

        case "close":
            return (
                <svg {...common}>
                    <path d="m6 6 12 12" />
                    <path d="m18 6-12 12" />
                </svg>
            );

        case "trash":
            return (
                <svg {...common}>
                    <path d="M4 7h16" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M6 7l1 14h10l1-14" />
                    <path d="M9 7V4h6v3" />
                </svg>
            );

        case "edit":
            return (
                <svg {...common}>
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
                </svg>
            );

        case "chevron":
            return (
                <svg {...common}>
                    <path d="m9 18 6-6-6-6" />
                </svg>
            );

        case "database":
            return (
                <svg {...common}>
                    <ellipse cx="12" cy="5" rx="8" ry="3" />
                    <path d="M4 5v7c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
                    <path d="M4 12v7c0 1.66 3.58 3 8 3s8-1.34 8-3v-7" />
                </svg>
            );

        default:
            return null;
    }
}


function StatCard({
    label,
    value,
    detail,
    icon,
}) {
    return (
        <div className="dashboard-stat-card">
            <div className="stat-card-top">
                <span className="stat-label">
                    {label}
                </span>

                <span className="stat-icon">
                    <Icon name={icon} size={18} />
                </span>
            </div>

            <div className="stat-value">
                {value}
            </div>

            {detail && (
                <div className="stat-detail">
                    {detail}
                </div>
            )}
        </div>
    );
}


function GalleryCard({
    image,
    selected,
    onToggle,
    onUpdated,
}) {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(
        String(image.title ?? "")
    );
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const saveTitle = async () => {
        const trimmed = title.trim();

        if (!trimmed) {
            setMessage("Title cannot be empty.");
            return;
        }

        try {
            setSaving(true);
            setMessage("");

            const updated = await renameImage(
                image.id,
                trimmed
            );

            onUpdated(updated);
            setEditing(false);
        } catch (error) {
            console.error("Rename error:", error);

            setMessage(
                error.message ||
                    "Unable to rename image."
            );
        } finally {
            setSaving(false);
        }
    };

    const cancelEditing = () => {
        setTitle(String(image.title ?? ""));
        setMessage("");
        setEditing(false);
    };

    return (
        <article
            className={`admin-gallery-card ${
                selected ? "is-selected" : ""
            }`}
        >
            <div className="gallery-card-image">
                <img
                    src={image.image_url}
                    alt={String(image.title ?? "")}
                    loading="lazy"
                />

                <label className="gallery-checkbox">
                    <input
                        type="checkbox"
                        checked={Boolean(selected)}
                        onChange={() =>
                            onToggle(image.id)
                        }
                    />
                    <span />
                </label>

                <div className="gallery-card-overlay">
                    <button
                        type="button"
                        onClick={() =>
                            onToggle(image.id)
                        }
                    >
                        {selected
                            ? "Selected"
                            : "Select"}
                    </button>
                </div>
            </div>

            <div className="gallery-card-content">
                {editing ? (
                    <>
                        <input
                            className="gallery-title-input"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                            disabled={saving}
                            autoFocus
                        />

                        {message && (
                            <p className="inline-error">
                                {message}
                            </p>
                        )}

                        <div className="inline-actions">
                            <button
                                type="button"
                                className="small-primary"
                                onClick={saveTitle}
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save"}
                            </button>

                            <button
                                type="button"
                                className="small-secondary"
                                onClick={cancelEditing}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="gallery-card-title-row">
                            <div>
                                <h3>
                                    {image.title ||
                                        "Untitled"}
                                </h3>

                                <span>
                                    {formatDate(
                                        image.created_at
                                    )}
                                </span>
                            </div>

                            <button
                                type="button"
                                className="icon-button"
                                title="Rename"
                                onClick={() => {
                                    setTitle(
                                        String(
                                            image.title ??
                                                ""
                                        )
                                    );
                                    setEditing(true);
                                    setMessage("");
                                }}
                            >
                                <Icon
                                    name="edit"
                                    size={16}
                                />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </article>
    );
}


export default function Admin() {
    const [session, setSession] = useState(null);
    const [loadingSession, setLoadingSession] =
        useState(true);

    const [activePage, setActivePage] =
        useState("dashboard");

    const [mobileSidebarOpen, setMobileSidebarOpen] =
        useState(false);

    const [gallery, setGallery] = useState([]);
    const [galleryLoading, setGalleryLoading] =
        useState(false);
    const [galleryError, setGalleryError] =
        useState("");

    const [selectedImages, setSelectedImages] =
        useState([]);

    const [search, setSearch] = useState("");

    const [stats, setStats] = useState({
        total_images: 0,
        uploads_today: 0,
        uploads_this_week: 0,
        uploads_this_month: 0,
        latest_upload: null,
        storage: null,
    });

    const [statsLoading, setStatsLoading] =
        useState(false);

    const [statsError, setStatsError] =
        useState("");

    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] =
        useState("");

    const [uploadMsg, setUploadMsg] = useState("");
    const [uploading, setUploading] =
        useState(false);

    const [dragActive, setDragActive] =
        useState(false);

    const fileInputRef = useRef(null);

    // ---------------------------------------------------------
    // SESSION
    // ---------------------------------------------------------

    useEffect(() => {
        let mounted = true;

        const initialiseSession = async () => {
            try {
                const {
                    data,
                    error,
                } =
                    await supabase.auth.getSession();

                if (error) {
                    console.error(
                        "Session error:",
                        error
                    );
                }

                if (!mounted) return;

                if (!data?.session) {
                    setSession(null);
                    return;
                }

                const storedStart =
                    localStorage.getItem(
                        "sessionStart"
                    );

                const sessionStart =
                    storedStart
                        ? Number(storedStart)
                        : Date.now();

                if (!storedStart) {
                    localStorage.setItem(
                        "sessionStart",
                        String(sessionStart)
                    );
                }

                if (
                    Date.now() - sessionStart >=
                    SESSION_LIMIT
                ) {
                    await supabase.auth.signOut();

                    localStorage.removeItem(
                        "sessionStart"
                    );

                    setSession(null);
                    return;
                }

                setSession(data.session);
            } catch (error) {
                console.error(
                    "Session initialisation error:",
                    error
                );
            } finally {
                if (mounted) {
                    setLoadingSession(false);
                }
            }
        };

        initialiseSession();

        return () => {
            mounted = false;
        };
    }, []);


    // ---------------------------------------------------------
    // SESSION TIMEOUT
    // ---------------------------------------------------------

    useEffect(() => {
        if (!session) return;

        let inactivityTimer;
        let sessionTimer;

        const logout = async () => {
            await supabase.auth.signOut();

            localStorage.removeItem(
                "sessionStart"
            );

            setSession(null);
            setGallery([]);
            setSelectedImages([]);
        };

        const resetInactivity = () => {
            clearTimeout(inactivityTimer);

            inactivityTimer = setTimeout(
                logout,
                INACTIVITY_LIMIT
            );
        };

        const events = [
            "mousemove",
            "mousedown",
            "keydown",
            "scroll",
            "touchstart",
        ];

        events.forEach((event) => {
            document.addEventListener(
                event,
                resetInactivity
            );
        });

        resetInactivity();

        const sessionStart = Number(
            localStorage.getItem(
                "sessionStart"
            )
        );

        if (sessionStart) {
            const remaining =
                SESSION_LIMIT -
                (Date.now() - sessionStart);

            if (remaining <= 0) {
                logout();
            } else {
                sessionTimer = setTimeout(
                    logout,
                    remaining
                );
            }
        }

        return () => {
            clearTimeout(inactivityTimer);
            clearTimeout(sessionTimer);

            events.forEach((event) => {
                document.removeEventListener(
                    event,
                    resetInactivity
                );
            });
        };
    }, [session]);


    // ---------------------------------------------------------
    // LOAD GALLERY
    // ---------------------------------------------------------

    const loadGallery = async () => {
        try {
            setGalleryLoading(true);
            setGalleryError("");

            const data = await getGallery();

            setGallery(
                Array.isArray(data)
                    ? data
                    : []
            );

            setSelectedImages([]);
        } catch (error) {
            console.error(
                "Gallery error:",
                error
            );

            setGalleryError(
                error.message ||
                    "Unable to load gallery."
            );
        } finally {
            setGalleryLoading(false);
        }
    };


    // ---------------------------------------------------------
    // LOAD STATS
    // ---------------------------------------------------------

    const loadStats = async () => {
        try {
            setStatsLoading(true);
            setStatsError("");

            const token =
                (
                    await supabase.auth.getSession()
                )?.data?.session
                    ?.access_token;

            if (!token) {
                throw new Error(
                    "You are not authenticated."
                );
            }

            const apiUrl =
                import.meta.env.VITE_API_URL ||
                "http://127.0.0.1:8000";

            const response =
                await fetch(
                    `${apiUrl}/api/admin/stats`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.detail ||
                        "Unable to load statistics."
                );
            }

            setStats({
                total_images:
                    data.total_images || 0,
                uploads_today:
                    data.uploads_today || 0,
                uploads_this_week:
                    data.uploads_this_week || 0,
                uploads_this_month:
                    data.uploads_this_month || 0,
                latest_upload:
                    data.latest_upload ||
                    null,
                storage:
                    data.storage || null,
            });
        } catch (error) {
            console.error(
                "Stats error:",
                error
            );

            setStatsError(
                error.message ||
                    "Unable to load statistics."
            );
        } finally {
            setStatsLoading(false);
        }
    };


    // ---------------------------------------------------------
    // LOAD DATA WHEN LOGGED IN
    // ---------------------------------------------------------

    useEffect(() => {
        if (!session) {
            return;
        }

        loadGallery();
        loadStats();
    }, [session]);


    // ---------------------------------------------------------
    // SEARCH
    // ---------------------------------------------------------

    const filteredGallery = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        if (!query) {
            return gallery;
        }

        return gallery.filter((image) =>
            String(
                image.title ?? ""
            )
                .toLowerCase()
                .includes(query)
        );
    }, [gallery, search]);


    // ---------------------------------------------------------
    // SELECT IMAGE
    // ---------------------------------------------------------

    const toggleSelectImage = (id) => {
        setSelectedImages((previous) => {
            if (previous.includes(id)) {
                return previous.filter(
                    (imageId) =>
                        imageId !== id
                );
            }

            return [
                ...previous,
                id,
            ];
        });
    };


    const selectAllVisible = () => {
        const visibleIds =
            filteredGallery.map(
                (image) => image.id
            );

        const allSelected =
            visibleIds.length > 0 &&
            visibleIds.every((id) =>
                selectedImages.includes(id)
            );

        if (allSelected) {
            setSelectedImages((previous) =>
                previous.filter(
                    (id) =>
                        !visibleIds.includes(id)
                )
            );
        } else {
            setSelectedImages((previous) => [
                ...new Set([
                    ...previous,
                    ...visibleIds,
                ]),
            ]);
        }
    };


    // ---------------------------------------------------------
    // UPDATE IMAGE
    // ---------------------------------------------------------

    const handleImageUpdated = (
        updatedImage
    ) => {
        setGallery((previous) =>
            previous.map((image) =>
                image.id ===
                updatedImage.id
                    ? updatedImage
                    : image
            )
        );

        setStats((previous) => ({
            ...previous,
            latest_upload:
                previous.latest_upload?.id ===
                updatedImage.id
                    ? updatedImage
                    : previous.latest_upload,
        }));
    };


    // ---------------------------------------------------------
    // DELETE SELECTED
    // ---------------------------------------------------------

    const handleDeleteSelected =
        async () => {
            if (
                selectedImages.length ===
                0
            ) {
                return;
            }

            const confirmed =
                window.confirm(
                    `Delete ${selectedImages.length} image${
                        selectedImages.length ===
                        1
                            ? ""
                            : "s"
                    }? This cannot be undone.`
                );

            if (!confirmed) {
                return;
            }

            try {
                await deleteImages(
                    selectedImages
                );

                setGallery((previous) =>
                    previous.filter(
                        (image) =>
                            !selectedImages.includes(
                                image.id
                            )
                    )
                );

                setStats((previous) => ({
                    ...previous,
                    total_images:
                        Math.max(
                            0,
                            previous.total_images -
                                selectedImages.length
                        ),
                }));

                setSelectedImages([]);
            } catch (error) {
                console.error(
                    "Delete error:",
                    error
                );

                window.alert(
                    error.message ||
                        "Unable to delete images."
                );
            }
        };


    // ---------------------------------------------------------
    // FILE PROCESSING
    // ---------------------------------------------------------

    const processFile = (selectedFile) => {
        if (!selectedFile) {
            return;
        }

        if (
            !selectedFile.type.startsWith(
                "image/"
            )
        ) {
            setUploadMsg(
                "Please select an image file."
            );

            return;
        }

        setFile(selectedFile);
        setUploadMsg("");

        if (previewUrl) {
            URL.revokeObjectURL(
                previewUrl
            );
        }

        setPreviewUrl(
            URL.createObjectURL(
                selectedFile
            )
        );
    };


    const handleFileChange = (event) => {
        processFile(
            event.target.files?.[0]
        );
    };


    const handleDrop = (event) => {
        event.preventDefault();
        setDragActive(false);

        processFile(
            event.dataTransfer.files?.[0]
        );
    };


    const clearFile = () => {
        if (previewUrl) {
            URL.revokeObjectURL(
                previewUrl
            );
        }

        setPreviewUrl("");
        setFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value =
                "";
        }
    };


    // ---------------------------------------------------------
    // STRIP METADATA
    // ---------------------------------------------------------

    const stripImageMetadata = (
        originalFile
    ) => {
        return new Promise(
            (resolve, reject) => {
                const img =
                    new Image();

                const objectUrl =
                    URL.createObjectURL(
                        originalFile
                    );

                img.onload = () => {
                    URL.revokeObjectURL(
                        objectUrl
                    );

                    const canvas =
                        document.createElement(
                            "canvas"
                        );

                    canvas.width =
                        img.naturalWidth;

                    canvas.height =
                        img.naturalHeight;

                    const context =
                        canvas.getContext(
                            "2d"
                        );

                    if (!context) {
                        reject(
                            new Error(
                                "Unable to process image."
                            )
                        );

                        return;
                    }

                    context.drawImage(
                        img,
                        0,
                        0
                    );

                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(
                                    new Error(
                                        "Unable to process image."
                                    )
                                );

                                return;
                            }

                            const cleanFile =
                                new File(
                                    [blob],
                                    originalFile.name.replace(
                                        /\.[^/.]+$/,
                                        ".jpg"
                                    ),
                                    {
                                        type: "image/jpeg",
                                    }
                                );

                            resolve(
                                cleanFile
                            );
                        },
                        "image/jpeg",
                        0.9
                    );
                };

                img.onerror = () => {
                    URL.revokeObjectURL(
                        objectUrl
                    );

                    reject(
                        new Error(
                            "Unable to read image."
                        )
                    );
                };

                img.src = objectUrl;
            }
        );
    };


    // ---------------------------------------------------------
    // UPLOAD
    // ---------------------------------------------------------

    const handleUpload = async (
        event
    ) => {
        event.preventDefault();

        if (!title.trim()) {
            setUploadMsg(
                "Please enter a title."
            );

            return;
        }

        if (!file) {
            setUploadMsg(
                "Please select an image."
            );

            return;
        }

        try {
            setUploading(true);
            setUploadMsg(
                "Processing image..."
            );

            const cleanFile =
                await stripImageMetadata(
                    file
                );

            setUploadMsg(
                "Uploading image..."
            );

            await uploadImage(
                title.trim(),
                cleanFile
            );

            setTitle("");
            clearFile();

            setUploadMsg(
                "Image uploaded successfully."
            );

            await Promise.all([
                loadGallery(),
                loadStats(),
            ]);
        } catch (error) {
            console.error(
                "Upload error:",
                error
            );

            setUploadMsg(
                error.message ||
                    "Unable to upload image."
            );
        } finally {
            setUploading(false);
        }
    };


    // ---------------------------------------------------------
    // NAVIGATION
    // ---------------------------------------------------------

    const navigate = (page) => {
        setActivePage(page);
        setMobileSidebarOpen(false);

        if (page === "dashboard") {
            loadStats();
        }

        if (page === "gallery") {
            loadGallery();
        }
    };


    // ---------------------------------------------------------
    // LOGOUT
    // ---------------------------------------------------------

    const handleLogout = async () => {
        await supabase.auth.signOut();

        localStorage.removeItem(
            "sessionStart"
        );

        setSession(null);
        setGallery([]);
        setSelectedImages([]);
    };


    // ---------------------------------------------------------
    // LOGIN
    // ---------------------------------------------------------

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loginError, setLoginError] =
        useState("");

    const handleLogin = async (
        event
    ) => {
        event.preventDefault();

        setLoginError("");

        try {
            const {
                data,
                error,
            } =
                await supabase.auth.signInWithPassword(
                    {
                        email,
                        password,
                    }
                );

            if (error) {
                setLoginError(
                    error.message ||
                        "Invalid login credentials."
                );

                return;
            }

            localStorage.setItem(
                "sessionStart",
                String(Date.now())
            );

            setSession(
                data?.session || null
            );
        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            setLoginError(
                "Unable to log in."
            );
        }
    };


    // ---------------------------------------------------------
    // LOADING
    // ---------------------------------------------------------

    if (loadingSession) {
        return (
            <div className="admin-loading-screen">
                <div className="admin-loader" />
                <span>
                    Loading admin...
                </span>
            </div>
        );
    }


    // ---------------------------------------------------------
    // LOGIN
    // ---------------------------------------------------------

    if (!session) {
        return (
            <div className="admin-login-page">
                <div className="admin-login-panel">
                    <div className="login-brand">
                        <span>
                            PORTRAITURE
                        </span>

                        <small>
                            ADMIN
                        </small>
                    </div>

                    <div className="login-heading">
                        <h1>
                            Welcome back.
                        </h1>

                        <p>
                            Sign in to manage
                            your gallery.
                        </p>
                    </div>

                    <form
                        className="login-form"
                        onSubmit={
                            handleLogin
                        }
                    >
                        <label>
                            Email
                            <input
                                type="email"
                                value={email}
                                onChange={(
                                    event
                                ) =>
                                    setEmail(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="you@example.com"
                                required
                            />
                        </label>

                        <label>
                            Password
                            <input
                                type="password"
                                value={
                                    password
                                }
                                onChange={(
                                    event
                                ) =>
                                    setPassword(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="••••••••"
                                required
                            />
                        </label>

                        {loginError && (
                            <div className="login-error">
                                {
                                    loginError
                                }
                            </div>
                        )}

                        <button
                            type="submit"
                            className="login-button"
                        >
                            Sign in
                            <Icon
                                name="chevron"
                                size={18}
                            />
                        </button>
                    </form>
                </div>
            </div>
        );
    }


    // ---------------------------------------------------------
    // ADMIN APPLICATION
    // ---------------------------------------------------------

    const pageTitles = {
        dashboard: "Dashboard",
        gallery: "Gallery",
        upload: "Upload",
        settings: "Settings",
    };


    return (
        <div className="admin-app">
            {mobileSidebarOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={() =>
                        setMobileSidebarOpen(
                            false
                        )
                    }
                />
            )}

            <aside
                className={`admin-sidebar ${
                    mobileSidebarOpen
                        ? "mobile-open"
                        : ""
                }`}
            >
                <div className="sidebar-brand">
                    <div>
                        <strong>
                            PORTRAITURE
                        </strong>

                        <span>
                            ADMIN
                        </span>
                    </div>

                    <button
                        type="button"
                        className="mobile-close"
                        onClick={() =>
                            setMobileSidebarOpen(
                                false
                            )
                        }
                    >
                        <Icon
                            name="close"
                            size={20}
                        />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <span className="nav-label">
                        Workspace
                    </span>

                    <button
                        type="button"
                        className={
                            activePage ===
                            "dashboard"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            navigate(
                                "dashboard"
                            )
                        }
                    >
                        <Icon
                            name="grid"
                            size={19}
                        />

                        <span>
                            Dashboard
                        </span>
                    </button>

                    <button
                        type="button"
                        className={
                            activePage ===
                            "gallery"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            navigate(
                                "gallery"
                            )
                        }
                    >
                        <Icon
                            name="image"
                            size={19}
                        />

                        <span>
                            Gallery
                        </span>

                        <small>
                            {gallery.length}
                        </small>
                    </button>

                    <button
                        type="button"
                        className={
                            activePage ===
                            "upload"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            navigate(
                                "upload"
                            )
                        }
                    >
                        <Icon
                            name="upload"
                            size={19}
                        />

                        <span>
                            Upload
                        </span>
                    </button>

                    <div className="nav-divider" />

                    <span className="nav-label">
                        Account
                    </span>

                    <button
                        type="button"
                        className={
                            activePage ===
                            "settings"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            navigate(
                                "settings"
                            )
                        }
                    >
                        <Icon
                            name="settings"
                            size={19}
                        />

                        <span>
                            Settings
                        </span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="online-status">
                        <span className="online-dot" />

                        <div>
                            <strong>
                                Online
                            </strong>

                            <small>
                                Admin session
                            </small>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={
                            handleLogout
                        }
                    >
                        <Icon
                            name="log-out"
                            size={18}
                        />

                        <span>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>


            <main className="admin-main">
                <header className="admin-topbar">
                    <button
                        type="button"
                        className="mobile-menu"
                        onClick={() =>
                            setMobileSidebarOpen(
                                true
                            )
                        }
                    >
                        <Icon
                            name="menu"
                            size={22}
                        />
                    </button>

                    <div className="topbar-page">
                        <span>
                            {pageTitles[
                                activePage
                            ]}
                        </span>
                    </div>

                    <div className="topbar-right">
                        <div className="topbar-online">
                            <span className="online-dot" />
                            Online
                        </div>
                    </div>
                </header>


                <div className="admin-content">

                    {/* =================================================
                        DASHBOARD
                    ================================================= */}

                    {activePage ===
                        "dashboard" && (
                        <section className="page-section">
                            <div className="page-heading">
                                <div>
                                    <span className="eyebrow">
                                        Overview
                                    </span>

                                    <h1>
                                        Dashboard
                                    </h1>

                                    <p>
                                        A quick
                                        overview
                                        of your
                                        photography
                                        archive.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={() =>
                                        navigate(
                                            "upload"
                                        )
                                    }
                                >
                                    <Icon
                                        name="upload"
                                        size={17}
                                    />

                                    Upload image
                                </button>
                            </div>

                            {statsError && (
                                <div className="dashboard-error">
                                    {statsError}

                                    <button
                                        type="button"
                                        onClick={
                                            loadStats
                                        }
                                    >
                                        Try again
                                    </button>
                                </div>
                            )}

                            <div className="stats-grid">
                                <StatCard
                                    label="Total images"
                                    value={
                                        statsLoading
                                            ? "—"
                                            : stats.total_images
                                    }
                                    detail="Images in your gallery"
                                    icon="image"
                                />

                                <StatCard
                                    label="This month"
                                    value={
                                        statsLoading
                                            ? "—"
                                            : stats.uploads_this_month
                                    }
                                    detail="Uploaded this month"
                                    icon="upload"
                                />

                                <StatCard
                                    label="This week"
                                    value={
                                        statsLoading
                                            ? "—"
                                            : stats.uploads_this_week
                                    }
                                    detail="Uploaded this week"
                                    icon="database"
                                />

                                <StatCard
                                    label="Today"
                                    value={
                                        statsLoading
                                            ? "—"
                                            : stats.uploads_today
                                    }
                                    detail="Uploaded today"
                                    icon="grid"
                                />
                            </div>


                            <div className="dashboard-columns">
                                <div className="dashboard-panel recent-panel">
                                    <div className="panel-header">
                                        <div>
                                            <span className="panel-eyebrow">
                                                Archive
                                            </span>

                                            <h2>
                                                Recent uploads
                                            </h2>
                                        </div>

                                        <button
                                            type="button"
                                            className="text-button"
                                            onClick={() =>
                                                navigate(
                                                    "gallery"
                                                )
                                            }
                                        >
                                            View gallery
                                            <Icon
                                                name="chevron"
                                                size={15}
                                            />
                                        </button>
                                    </div>

                                    {gallery.length ===
                                    0 ? (
                                        <div className="empty-state compact">
                                            <Icon
                                                name="image"
                                                size={26}
                                            />

                                            <p>
                                                No images
                                                uploaded
                                                yet.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="recent-grid">
                                            {gallery
                                                .slice(
                                                    0,
                                                    5
                                                )
                                                .map(
                                                    (
                                                        image
                                                    ) => (
                                                        <button
                                                            type="button"
                                                            className="recent-image"
                                                            key={
                                                                image.id
                                                            }
                                                            onClick={() =>
                                                                navigate(
                                                                    "gallery"
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={
                                                                    image.image_url
                                                                }
                                                                alt={
                                                                    image.title
                                                                }
                                                            />

                                                            <span>
                                                                {
                                                                    image.title
                                                                }
                                                            </span>
                                                        </button>
                                                    )
                                                )}
                                        </div>
                                    )}
                                </div>


                                <div className="dashboard-panel latest-panel">
                                    <div className="panel-header">
                                        <div>
                                            <span className="panel-eyebrow">
                                                Latest
                                            </span>

                                            <h2>
                                                Latest upload
                                            </h2>
                                        </div>
                                    </div>

                                    {stats.latest_upload ? (
                                        <div className="latest-upload">
                                            <img
                                                src={
                                                    stats
                                                        .latest_upload
                                                        .image_url
                                                }
                                                alt={
                                                    stats
                                                        .latest_upload
                                                        .title
                                                }
                                            />

                                            <div>
                                                <h3>
                                                    {
                                                        stats
                                                            .latest_upload
                                                            .title
                                                    }
                                                </h3>

                                                <p>
                                                    Uploaded{" "}
                                                    {formatRelativeDate(
                                                        stats
                                                            .latest_upload
                                                            .created_at
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="empty-state compact">
                                            <p>
                                                No uploads
                                                yet.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>


                            <div className="dashboard-panel storage-panel">
                                <div className="panel-header">
                                    <div>
                                        <span className="panel-eyebrow">
                                            Storage
                                        </span>

                                        <h2>
                                            Storage usage
                                        </h2>
                                    </div>

                                    {stats.storage && (
                                        <strong>
                                            {stats.storage.used_percentage?.toFixed(
                                                0
                                            )}
                                            %
                                        </strong>
                                    )}
                                </div>

                                {stats.storage ? (
                                    <>
                                        <div className="storage-bar">
                                            <span
                                                style={{
                                                    width: `${Math.min(
                                                        stats
                                                            .storage
                                                            .used_percentage ||
                                                            0,
                                                        100
                                                    )}%`,
                                                }}
                                            />
                                        </div>

                                        <div className="storage-meta">
                                            <span>
                                                {formatBytes(
                                                    stats
                                                        .storage
                                                        .used_bytes
                                                )}{" "}
                                                used
                                            </span>

                                            <span>
                                                {formatBytes(
                                                    stats
                                                        .storage
                                                        .limit_bytes
                                                )}{" "}
                                                total
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="storage-unavailable">
                                        <span>
                                            Storage
                                            information
                                            will appear
                                            here once
                                            enabled.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}


                    {/* =================================================
                        GALLERY
                    ================================================= */}

                    {activePage ===
                        "gallery" && (
                        <section className="page-section">
                            <div className="page-heading">
                                <div>
                                    <span className="eyebrow">
                                        Archive
                                    </span>

                                    <h1>
                                        Gallery
                                    </h1>

                                    <p>
                                        Manage your
                                        published
                                        portraits.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={() =>
                                        navigate(
                                            "upload"
                                        )
                                    }
                                >
                                    <Icon
                                        name="upload"
                                        size={17}
                                    />

                                    Upload image
                                </button>
                            </div>


                            <div className="gallery-toolbar">
                                <div className="search-box">
                                    <Icon
                                        name="search"
                                        size={18}
                                    />

                                    <input
                                        type="search"
                                        placeholder="Search images..."
                                        value={search}
                                        onChange={(
                                            event
                                        ) =>
                                            setSearch(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />
                                </div>

                                <div className="toolbar-actions">
                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={
                                            selectAllVisible
                                        }
                                    >
                                        {filteredGallery.length >
                                            0 &&
                                        filteredGallery.every(
                                            (
                                                image
                                            ) =>
                                                selectedImages.includes(
                                                    image.id
                                                )
                                        )
                                            ? "Deselect all"
                                            : "Select all"}
                                    </button>

                                    {selectedImages.length >
                                        0 && (
                                        <button
                                            type="button"
                                            className="delete-button"
                                            onClick={
                                                handleDeleteSelected
                                            }
                                        >
                                            <Icon
                                                name="trash"
                                                size={
                                                    17
                                                }
                                            />

                                            Delete (
                                            {
                                                selectedImages.length
                                            }
                                            )
                                        </button>
                                    )}
                                </div>
                            </div>


                            {galleryLoading ? (
                                <div className="gallery-loading-grid">
                                    {Array.from({
                                        length: 8,
                                    }).map(
                                        (
                                            _,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    index
                                                }
                                                className="gallery-skeleton"
                                            />
                                        )
                                    )}
                                </div>
                            ) : galleryError ? (
                                <div className="large-empty-state">
                                    <Icon
                                        name="image"
                                        size={32}
                                    />

                                    <h2>
                                        Unable to
                                        load gallery
                                    </h2>

                                    <p>
                                        {
                                            galleryError
                                        }
                                    </p>

                                    <button
                                        type="button"
                                        className="primary-button"
                                        onClick={
                                            loadGallery
                                        }
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : filteredGallery.length ===
                              0 ? (
                                <div className="large-empty-state">
                                    <Icon
                                        name="image"
                                        size={32}
                                    />

                                    <h2>
                                        {search
                                            ? "No images found"
                                            : "Your gallery is empty"}
                                    </h2>

                                    <p>
                                        {search
                                            ? "Try a different search."
                                            : "Upload your first image to get started."}
                                    </p>

                                    {!search && (
                                        <button
                                            type="button"
                                            className="primary-button"
                                            onClick={() =>
                                                navigate(
                                                    "upload"
                                                )
                                            }
                                        >
                                            Upload image
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="admin-gallery-grid">
                                    {filteredGallery.map(
                                        (
                                            image
                                        ) => (
                                            <GalleryCard
                                                key={
                                                    image.id
                                                }
                                                image={
                                                    image
                                                }
                                                selected={selectedImages.includes(
                                                    image.id
                                                )}
                                                onToggle={
                                                    toggleSelectImage
                                                }
                                                onUpdated={
                                                    handleImageUpdated
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            )}
                        </section>
                    )}


                    {/* =================================================
                        UPLOAD
                    ================================================= */}

                    {activePage ===
                        "upload" && (
                        <section className="page-section upload-page">
                            <div className="page-heading">
                                <div>
                                    <span className="eyebrow">
                                        New work
                                    </span>

                                    <h1>
                                        Upload image
                                    </h1>

                                    <p>
                                        Add a new
                                        portrait to
                                        your gallery.
                                    </p>
                                </div>
                            </div>

                            <div className="upload-layout">
                                <form
                                    className="upload-panel"
                                    onSubmit={
                                        handleUpload
                                    }
                                >
                                    <div
                                        className={`drop-zone ${
                                            dragActive
                                                ? "drag-active"
                                                : ""
                                        } ${
                                            file
                                                ? "has-file"
                                                : ""
                                        }`}
                                        onDragOver={(
                                            event
                                        ) => {
                                            event.preventDefault();
                                            setDragActive(
                                                true
                                            );
                                        }}
                                        onDragLeave={() =>
                                            setDragActive(
                                                false
                                            )
                                        }
                                        onDrop={
                                            handleDrop
                                        }
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        <input
                                            ref={
                                                fileInputRef
                                            }
                                            type="file"
                                            accept="image/*"
                                            onChange={
                                                handleFileChange
                                            }
                                            hidden
                                        />

                                        {previewUrl ? (
                                            <div className="upload-preview">
                                                <img
                                                    src={
                                                        previewUrl
                                                    }
                                                    alt="Preview"
                                                />

                                                <div className="preview-overlay">
                                                    <span>
                                                        Change
                                                        image
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="upload-icon">
                                                    <Icon
                                                        name="upload"
                                                        size={
                                                            25
                                                        }
                                                    />
                                                </div>

                                                <h3>
                                                    Drop an
                                                    image
                                                    here
                                                </h3>

                                                <p>
                                                    or click
                                                    to browse
                                                </p>

                                                <span>
                                                    JPG,
                                                    PNG,
                                                    WEBP
                                                </span>
                                            </>
                                        )}
                                    </div>


                                    {file && (
                                        <button
                                            type="button"
                                            className="remove-file"
                                            onClick={
                                                clearFile
                                            }
                                        >
                                            Remove selected
                                            image
                                        </button>
                                    )}


                                    <div className="upload-field">
                                        <label htmlFor="image-title">
                                            Image title
                                        </label>

                                        <input
                                            id="image-title"
                                            type="text"
                                            value={
                                                title
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setTitle(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Give your image a title"
                                            maxLength={
                                                200
                                            }
                                        />

                                        <span>
                                            {title.length}
                                            /200
                                        </span>
                                    </div>


                                    {uploadMsg && (
                                        <div
                                            className={
                                                uploadMsg.includes(
                                                    "successfully"
                                                )
                                                    ? "upload-success"
                                                    : "upload-feedback"
                                            }
                                        >
                                            {
                                                uploadMsg
                                            }
                                        </div>
                                    )}


                                    <button
                                        type="submit"
                                        className="upload-submit"
                                        disabled={
                                            uploading ||
                                            !file ||
                                            !title.trim()
                                        }
                                    >
                                        {uploading
                                            ? "Uploading..."
                                            : "Upload image"}

                                        {!uploading && (
                                            <Icon
                                                name="chevron"
                                                size={
                                                    18
                                                }
                                            />
                                        )}
                                    </button>
                                </form>


                                <aside className="upload-info">
                                    <div className="upload-info-header">
                                        <span>
                                            Before you
                                            upload
                                        </span>
                                    </div>

                                    <div className="upload-info-item">
                                        <strong>
                                            Image quality
                                        </strong>

                                        <p>
                                            Upload the
                                            highest
                                            quality
                                            version of
                                            your image.
                                        </p>
                                    </div>

                                    <div className="upload-info-item">
                                        <strong>
                                            Privacy
                                        </strong>

                                        <p>
                                            Image metadata
                                            is stripped
                                            before the
                                            file is stored.
                                        </p>
                                    </div>

                                    <div className="upload-info-item">
                                        <strong>
                                            File types
                                        </strong>

                                        <p>
                                            JPG, PNG and
                                            other standard
                                            image formats
                                            are supported.
                                        </p>
                                    </div>
                                </aside>
                            </div>
                        </section>
                    )}


                    {/* =================================================
                        SETTINGS
                    ================================================= */}

                    {activePage ===
                        "settings" && (
                        <section className="page-section">
                            <div className="page-heading">
                                <div>
                                    <span className="eyebrow">
                                        Account
                                    </span>

                                    <h1>
                                        Settings
                                    </h1>

                                    <p>
                                        Manage your
                                        admin session.
                                    </p>
                                </div>
                            </div>

                            <div className="settings-panel">
                                <div className="settings-section">
                                    <div>
                                        <span className="panel-eyebrow">
                                            Session
                                        </span>

                                        <h2>
                                            Admin access
                                        </h2>

                                        <p>
                                            You are
                                            currently
                                            signed in to
                                            the
                                            Portraiture
                                            admin
                                            portal.
                                        </p>
                                    </div>

                                    <div className="settings-status">
                                        <span className="online-dot" />
                                        Active
                                    </div>
                                </div>

                                <div className="settings-divider" />

                                <div className="settings-section">
                                    <div>
                                        <span className="panel-eyebrow">
                                            Security
                                        </span>

                                        <h2>
                                            Automatic
                                            logout
                                        </h2>

                                        <p>
                                            Your admin
                                            session
                                            automatically
                                            expires after
                                            a period of
                                            inactivity.
                                        </p>
                                    </div>
                                </div>

                                <div className="settings-divider" />

                                <div className="settings-section danger-settings">
                                    <div>
                                        <span className="panel-eyebrow">
                                            Account
                                        </span>

                                        <h2>
                                            Sign out
                                        </h2>

                                        <p>
                                            End your
                                            current admin
                                            session.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="delete-button"
                                        onClick={
                                            handleLogout
                                        }
                                    >
                                        <Icon
                                            name="log-out"
                                            size={17}
                                        />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}
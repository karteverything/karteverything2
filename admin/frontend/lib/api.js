import supabase from "./supabase";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

async function getAccessToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
}

async function apiFetch(endpoint, options = {}) {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.headers || {}),
      },
    }
  );
  let data = null;

  try {
    data = await response.json();
  } catch {
    // Response wasn't JSON.
  }

  if (!response.ok) {
    console.error(
      "API error:",
      response.status,
      data
    );

    let message = `API request failed (${response.status})`;

    if (typeof data?.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data?.detail)) {
      message = data.detail
        .map((item) => {
          const location = item.loc
            ? item.loc.join(".")
            : "field";

          return `${location}: ${item.msg}`;
        })
        .join("\n");
    } else if (data?.detail) {
      message = JSON.stringify(
        data.detail
      );
    }
    throw new Error(message);
  }
  return data;
}

async function authenticatedFetch(
  endpoint,
  options = {}
) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("You are not authenticated.");
  }

  return apiFetch(endpoint, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getGallery() {
  return apiFetch("/api/gallery");
}

export async function getGalleryImage(id) {
  return apiFetch(`/api/gallery/${id}`);
}

export async function uploadImage(title, file) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("file", file);

  return authenticatedFetch("/api/gallery", {
    method: "POST",
    body: formData,
  });
}

export async function renameImage(id, title) {
  return authenticatedFetch(
    `/api/gallery/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
      }),
    }
  );
}

export async function deleteImage(id) {
  return authenticatedFetch(
    `/api/gallery/${id}`,
    {
      method: "DELETE",
    }
  );
}

export async function deleteImages(ids) {
  return authenticatedFetch(
    "/api/gallery",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids,
      }),
    }
  );
}

export async function getAdminStats() {
    return authenticatedFetch("/api/admin/stats");
}
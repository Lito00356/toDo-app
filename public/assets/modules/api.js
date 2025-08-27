// api.js
const API_URL = "http://localhost:2007";

export async function fetchAllTasks() {
  try {
    console.log(API_URL);
    const response = await fetch(`${API_URL}/api/tasks`);
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error("Error fetching tasks: ", error);
  }
}

export async function createNewTask(content) {
  return await apiRequest(`${API_URL}/api/tasks`, "POST", content);
}

export async function deleteTask(itemID) {
  return await apiRequest(`${API_URL}/api/tasks/${itemID}`, "DELETE");
}

export async function editTask(id, content) {
  return await apiRequest(`${API_URL}/api/tasks/${id}`, "PATCH", content);
}

export async function changeCompleteStatus(id, content) {
  return await apiRequest(`${API_URL}/api/tasks/${id}`, "PATCH", content);
}

async function apiRequest(url, method, body = null) {
  try {
    const response = await fetch(url, {
      method,
      body: body ? JSON.stringify(body) : null,
      headers: { "Content-Type": "application/json" },
    });
    return response.ok ? await response.json() : Promise.reject("API Error");
  } catch (error) {
    console.error("API Request Failed: ", error);
  }
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


type Teaching = {
  id: number;
  title: string;
  category: string;
};

type Admin = {
  id: number;
  username: string;
  role: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [teachings, setTeachings] = useState<Teaching[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [role, setRole] = useState("");

  const [adminUsername, setAdminUsername] = useState("");

  const [adminPassword, setAdminPassword] = useState("");

  const [adminRole, setAdminRole] = useState("admin");

  const [editingAdminId, setEditingAdminId] = useState<number | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);

  async function fetchTeachings() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teachings`);

    const data = await response.json();

    setTeachings(data);
  }

useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  setRole(
    localStorage.getItem("role") || ""
  );

  fetchTeachings();

  if (
  localStorage.getItem("role") === "superadmin"
) {
  fetchAdmins();
}

}, []);

async function fetchAdmins() {

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admins`,
    {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) return;

  const data = await response.json();

  setAdmins(data);
}

  async function createTeaching() {
    if (!title || !category) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teachings`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify({
    title,
    category,
  }),
});

    resetForm();

    fetchTeachings();
  }

  async function updateTeaching() {
    if (!editingId) return;

    await await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teachings/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        category,
      }),
    });

    resetForm();

    fetchTeachings();
  }

  async function deleteTeaching(id: number) {
    await await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teachings/${id}`, {
      method: "DELETE",
    });

    fetchTeachings();
  }

  async function createAdmin() {

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/create-admin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        username: adminUsername,
        password: adminPassword,
        role: adminRole,
      }),
    }
  );

  if (!response.ok) {
    alert("Failed to create admin");
    return;
  }

  alert("Admin created successfully");

  setAdminUsername("");
  setAdminPassword("");
  setAdminRole("admin");

  fetchAdmins();
}

async function updateAdmin() {

  if (!editingAdminId) return;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admins/${editingAdminId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        username: adminUsername,
        password: adminPassword,
        role: adminRole,
      }),
    }
  );

  if (!response.ok) {
    alert("Failed to update admin");
    return;
  }

  alert("Admin updated successfully");

  setEditingAdminId(null);

  setAdminUsername("");
  setAdminPassword("");
  setAdminRole("admin");

  fetchAdmins();
}

async function deleteAdmin(id: number) {

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admins/${id}`,
    {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    alert("Failed to delete admin");
    return;
  }

  alert("Admin deleted successfully");

  setEditingAdminId(null);

setAdminUsername("");

setAdminPassword("");

setAdminRole("admin");

  fetchAdmins();
}

function startEditingAdmin(admin: Admin) {

  setEditingAdminId(admin.id);

  setAdminUsername(admin.username);

  setAdminRole(admin.role);

  setAdminPassword("");
}

  function startEditing(teaching: Teaching) {
    setEditingId(teaching.id);

    setTitle(teaching.title);
    setCategory(teaching.category);
  }

  function resetForm() {
    setEditingId(null);

    setTitle("");
    setCategory("");
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-12">

          <h1 className="text-5xl font-bold text-yellow-400">
            Dhamma Online Admin
          </h1>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="bg-red-500 hover:bg-red-400 text-white px-5 py-3 rounded-2xl transition"
          >
            Logout
          </button>

        </div>


{role === "superadmin" && (

  <div className="bg-stone-950 border border-stone-800 rounded-3xl p-8 mb-12">

    <h2 className="text-3xl font-semibold text-yellow-400 mb-4">
      Admin Management
    </h2>

<div className="grid gap-4 md:grid-cols-3">

  <input
    type="text"
    placeholder="Username"
    value={adminUsername}
    onChange={(e) =>
      setAdminUsername(e.target.value)
    }
    className="bg-black border border-stone-700 rounded-xl px-4 py-3 outline-none focus:border-yellow-500"
  />

  <input
    type="password"
    placeholder="Password"
    value={adminPassword}
    onChange={(e) =>
      setAdminPassword(e.target.value)
    }
    className="bg-black border border-stone-700 rounded-xl px-4 py-3 outline-none focus:border-yellow-500"
  />

  <select
    value={adminRole}
    onChange={(e) =>
      setAdminRole(e.target.value)
    }
    className="bg-black border border-stone-700 rounded-xl px-4 py-3 outline-none focus:border-yellow-500"
  >
    <option value="admin">Admin</option>
    <option value="editor">Editor</option>
  </select>

</div>

<button
  onClick={
    editingAdminId
      ? updateAdmin
      : createAdmin
  }
  className="mt-6 bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition"
>
  {editingAdminId
    ? "Update Admin"
    : "Create Admin"}
</button>

<div className="mt-10 border border-stone-800 rounded-2xl overflow-hidden">

  <div className="grid grid-cols-12 bg-black px-6 py-4 border-b border-stone-800 font-semibold text-stone-300">
    <div className="col-span-5">Username</div>
    <div className="col-span-4">Role</div>
    <div className="col-span-3 text-right">Actions</div>
  </div>

  {admins.map((admin) => (

    <div
      key={admin.id}
      className="grid grid-cols-12 px-6 py-4 border-b border-stone-900 items-center"
    >

      <div className="col-span-5">
        {admin.username}
      </div>

      <div className="col-span-4 text-stone-400">
        {admin.role}
      </div>

      <div className="col-span-3 text-right">

    <button
  onClick={() => startEditingAdmin(admin)}
  className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg transition mr-3"
>
  Update
</button>
        
        <button
  onClick={() => deleteAdmin(admin.id)}
  className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-lg transition"
>
  Delete
</button>

      </div>

    </div>

  ))}

</div>


  </div>

)}

        {/* Form */}
        <div className="bg-stone-950 border border-stone-800 rounded-3xl p-8 mb-12">
          
          <h2 className="text-3xl font-semibold mb-6">
            {editingId ? "Update Teaching" : "Create Teaching"}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Teaching title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-black border border-stone-700 rounded-xl px-4 py-3 outline-none focus:border-yellow-500"
            />

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-black border border-stone-700 rounded-xl px-4 py-3 outline-none focus:border-yellow-500"
            />
          </div>

          <div className="flex gap-4 mt-6">
            {editingId ? (
              <>
                <button
                  onClick={updateTeaching}
                  className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  Save Update
                </button>

                <button
                  onClick={resetForm}
                  className="bg-stone-700 hover:bg-stone-600 px-6 py-3 rounded-xl transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={createTeaching}
                className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition"
              >
                Create Teaching
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="border border-stone-800 rounded-3xl overflow-hidden">

          <div className="grid grid-cols-12 bg-stone-950 px-6 py-4 border-b border-stone-800 font-semibold text-stone-300">
            <div className="col-span-4">Title</div>
            <div className="col-span-4">Category</div>
            <div className="col-span-4 text-right">Actions</div>
          </div>

          {teachings.map((teaching) => (
            <div
              key={teaching.id}
              className="grid grid-cols-12 px-6 py-5 border-b border-stone-900 items-center"
            >
              <div className="col-span-4 font-medium">
                {teaching.title}
              </div>

              <div className="col-span-4 text-stone-400">
                {teaching.category}
              </div>

              <div className="col-span-4 flex justify-end gap-3">

                <button
                  onClick={() => startEditing(teaching)}
                  className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg transition"
                >
                  Update
                </button>

                <button
                  onClick={() => deleteTeaching(teaching.id)}
                  className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-lg transition"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

        </div>

      </div>
    </main>
  );
}
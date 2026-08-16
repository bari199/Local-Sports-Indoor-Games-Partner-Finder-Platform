import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Trophy,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  getAdminGames,
  createAdminGame,
  updateAdminGame,
  deleteAdminGame,
} from "@/services/adminService";

const emptyForm = {
  name: "",
  description: "",
  image: "",
};

const AdminGames = () => {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminGames();

      if (data.success) {
        setGames(data.games);
      } else {
        setError(
          data.message || "Failed to load games"
        );
      }
    } catch (error) {
      console.error("Admin games error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load games"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const openCreateModal = () => {
    setEditingGame(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (game) => {
    setEditingGame(game);

    setForm({
      name: game.name || "",
      description: game.description || "",
      image: game.image || "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingGame(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return;
    }

    try {
      setSaving(true);

      if (editingGame) {
        const data = await updateAdminGame(
          editingGame._id,
          form
        );

        if (data.success) {
          setGames((prev) =>
            prev.map((game) =>
              game._id === editingGame._id
                ? data.game
                : game
            )
          );

          closeModal();
        }
      } else {
        const data = await createAdminGame(form);

        if (data.success) {
          setGames((prev) => [
            data.game,
            ...prev,
          ]);

          closeModal();
        }
      }
    } catch (error) {
      console.error(
        "Save game error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save game"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (gameId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this game?"
    );

    if (!confirmed) return;

    try {
      const data = await deleteAdminGame(
        gameId
      );

      if (data.success) {
        setGames((prev) =>
          prev.filter(
            (game) => game._id !== gameId
          )
        );
      }
    } catch (error) {
      console.error(
        "Delete game error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete game"
      );
    }
  };

  const filteredGames = games.filter((game) =>
    game.name
      ?.toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Games
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage games available on SportsConnect
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0078BD] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#006aa8]"
          >
            <Plus size={18} />
            Add Game
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-6 w-full sm:w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search games..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#0078BD] focus:ring-2 focus:ring-sky-100"
          />
        </div>

        {/* Content */}
        <div className="mt-6">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-52 animate-pulse rounded-2xl bg-white"
                  />
                )
              )}
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white py-16 text-center">
              <Trophy
                size={32}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 font-semibold text-slate-800">
                No games found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add a new game or change your search.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGames.map((game) => (
                <div
                  key={game._id}
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
                >
                  <div className="flex h-36 items-center justify-center bg-slate-50">
                    {game.image ? (
                      <img
                        src={game.image}
                        alt={game.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Trophy
                        size={42}
                        className="text-[#0078BD]"
                      />
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-slate-900">
                      {game.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                      {game.description ||
                        "No description available."}
                    </p>

                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(game)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(game._id)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingGame
                    ? "Edit Game"
                    : "Add Game"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Manage game information
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Game Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Badminton"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0078BD] focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe this game..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0078BD] focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Image URL
                </label>

                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0078BD] focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#0078BD] px-5 py-3 text-sm font-semibold text-white hover:bg-[#006aa8] disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingGame
                    ? "Update Game"
                    : "Create Game"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGames;
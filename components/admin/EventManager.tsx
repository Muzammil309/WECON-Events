"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Save, X, Calendar, Loader2 } from "lucide-react"
import { api, type Event } from "@/lib/supabase"

export default function EventManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [search, setSearch] = useState("")

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [form, setForm] = useState<Partial<Event>>({
    name: "",
    slug: "",
    description: "",
    timezone: "UTC",
    start_date: "",
    end_date: "",
    status: "DRAFT",
    primary_color: "#764DF0",
    secondary_color: "#442490",
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError("")
    try {
      const data = await api.getEvents()
      setEvents(data)
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to load events")
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditingId(null)
    setForm({
      name: "",
      slug: "",
      description: "",
      timezone: "UTC",
      start_date: new Date().toISOString().slice(0, 16),
      end_date: new Date(Date.now() + 3600_000).toISOString().slice(0, 16),
      status: "DRAFT",
      primary_color: "#764DF0",
      secondary_color: "#442490",
    })
    setIsFormOpen(true)
  }

  function openEdit(evt: any) {
    const name = evt.name ?? evt.title ?? ""
    const startRaw = evt.start_date ?? evt.start_time ?? evt.startAt ?? ""
    const endRaw = evt.end_date ?? evt.end_time ?? evt.endAt ?? ""
    setEditingId(evt.id as any)
    setForm({
      name,
      slug: evt.slug,
      description: evt.description,
      timezone: evt.timezone,
      start_date: startRaw ? String(startRaw).slice(0, 16) : "",
      end_date: endRaw ? String(endRaw).slice(0, 16) : "",
      status: evt.status,
      primary_color: evt.primary_color,
      secondary_color: evt.secondary_color,
      max_attendees: evt.max_attendees,
    })
    setIsFormOpen(true)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const payload = {
        ...form,
        // Convert datetime-local back to ISO for DB
        start_date: form.start_date ? new Date(form.start_date).toISOString() : undefined,
        end_date: form.end_date ? new Date(form.end_date).toISOString() : undefined,
      }
      if (editingId == null) {
        await api.createEvent(payload)
      } else {
        await api.updateEvent(editingId, payload)
      }
      setIsFormOpen(false)
      await load()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to save event")
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(id: string | number) {
    if (!confirm("Delete this event? This action cannot be undone.")) return
    try {
      await api.deleteEvent(id)
      await load()
    } catch (e: any) {
      alert(e?.message || "Failed to delete event")
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return events
    return events.filter((e: any) =>
      [e.name ?? e.title ?? "", e.slug, e.description]
        .some((v) => (v || "").toLowerCase().includes(q))
    )
  }, [events, search])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Event Management</h2>
          <p className="text-gray-400">Create, edit, and manage events with live Supabase data</p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
          />
          <button onClick={openCreate} className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80">
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>
      )}

      {/* Events list */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((evt) => (
          <motion.div key={String(evt.id)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{(evt as any).name ?? (evt as any).title ?? "Untitled"}</h3>
                <p className="text-xs text-gray-400">{(evt as any).slug}</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-gray-300 capitalize">{(evt.status || "DRAFT").toString().toLowerCase()}</span>
            </div>
            {evt.description && (
              <p className="text-gray-400 text-sm line-clamp-3 mb-3">{evt.description}</p>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
              <Calendar className="w-4 h-4" />
              <span>
                {(() => { const s = (evt as any).start_date ?? (evt as any).start_time ?? (evt as any).startAt; return s ? new Date(s).toLocaleString() : "" })()} — {(() => { const e = (evt as any).end_date ?? (evt as any).end_time ?? (evt as any).endAt; return e ? new Date(e).toLocaleString() : "" })()}
              </span>
            </div>
            <div className="flex items-center justify-end space-x-2">
              <button onClick={() => openEdit(evt)} className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 text-sm flex items-center space-x-1">
                <Edit className="w-4 h-4" /> <span>Edit</span>
              </button>
              <button onClick={() => onDelete(evt.id as any)} className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 text-sm flex items-center space-x-1">
                <Trash2 className="w-4 h-4" /> <span>Delete</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background border border-white/10 rounded-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg text-white font-semibold">{editingId == null ? "Create Event" : "Edit Event"}</h3>
              <button onClick={() => setIsFormOpen(false)} className="p-2 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={onSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Name</label>
                  <input value={form.name || ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Slug</label>
                  <input value={form.slug || ""} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Description</label>
                  <textarea value={form.description || ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Start</label>
                  <input type="datetime-local" value={form.start_date || ""} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">End</label>
                  <input type="datetime-local" value={form.end_date || ""} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Timezone</label>
                  <input value={form.timezone || "UTC"} onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Status</label>
                  <select value={form.status || "DRAFT"} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as any }))} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="LIVE">Live</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 flex items-center gap-2">
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button disabled={saving} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 flex items-center gap-2 disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


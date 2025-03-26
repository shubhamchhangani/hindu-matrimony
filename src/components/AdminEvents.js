import { useState, useEffect } from 'react';
import supabase from '../utils/supabase/client';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', image_url: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error.message);
      } else {
        setEvents(data);
      }
    };

    fetchEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from('events')
      .insert([newEvent]);

    if (error) {
      console.error('Error creating event:', error.message);
    } else {
      setEvents([...events, data[0]]);
      setNewEvent({ title: '', description: '', date: '', image_url: '' });
    }

    setLoading(false);
  };

  const handleDeleteEvent = async (id) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error.message);
    } else {
      setEvents(events.filter(event => event.id !== id));
    }
  };

  return (
    <section className="py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Manage Events</h2>
      <form onSubmit={handleCreateEvent} className="mb-8 p-4 bg-white rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newEvent.image_url}
          onChange={(e) => setNewEvent({ ...newEvent, image_url: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#b22222] text-white px-4 py-2 rounded w-full hover:bg-red-700"
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={event.image_url || '/default-event.jpg'}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4">{new Date(event.date).toLocaleDateString()}</p>
              <p className="text-gray-800">{event.description}</p>
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminEvents;
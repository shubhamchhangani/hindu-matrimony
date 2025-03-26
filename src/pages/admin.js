import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { fetchEvents, createEvent, deleteEvent, updateEvent } from '../redux/slices/eventsSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

const AdminHome = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const events = useSelector((state) => state.events.events);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', image_url: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        router.push('/signin');
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error || data.role !== 'admin') {
          router.push('/');
        } else {
          dispatch(fetchEvents());
        }
      }
    };

    checkAdmin();
  }, [user, router, dispatch]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(createEvent({ ...newEvent, admin_user_id: user.id })).unwrap();
      setNewEvent({ title: '', description: '', date: '', image_url: '' });
    } catch (error) {
      console.error('Error creating event:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await dispatch(deleteEvent(id)).unwrap();
    } catch (error) {
      console.error('Error deleting event:', error.message);
    }
  };

  const handleUpdateEvent = async (id, updatedEvent) => {
    try {
      await dispatch(updateEvent({ id, updatedEvent })).unwrap();
    } catch (error) {
      console.error('Error updating event:', error.message);
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
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
              <Image
                src={event.image_url || '/default-event.jpg'}
                alt={event.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{new Date(event.date).toLocaleDateString()}</p>
                <p className="text-gray-800 mb-4">{event.description}</p>
                <p className="text-gray-600">Created by: {event.profiles.full_name}</p>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleUpdateEvent(event.id, { title: 'Updated Title' })}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminHome;
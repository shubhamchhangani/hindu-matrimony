import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import supabase from '../utils/supabase/client';
import { fetchEvents, createEvent, deleteEvent, updateEvent } from '../redux/slices/eventsSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

const AdminHome = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const events = useSelector((state) => state.events.events);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', image: null });
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // State for the event being edited
  const [updatedEvent, setUpdatedEvent] = useState({ title: '', description: '', date: '', image: null });

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
      let imageUrl = '';

      // If an image is uploaded, upload it to Supabase
      if (newEvent.image) {
        const fileExt = newEvent.image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('events-images')
          .upload(fileName, newEvent.image);

        if (error) {
          console.error('Error uploading image:', error.message);
          setLoading(false);
          return;
        }

        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/events-images/${fileName}`;
      }

      // Dispatch the createEvent action with the image URL
      await dispatch(
        createEvent({
          title: newEvent.title,
          description: newEvent.description,
          date: newEvent.date,
          image_url: imageUrl,
          admin_user_id: user.id,
        })
      ).unwrap();

     

      // Reset the form
      setNewEvent({ title: '', description: '', date: '', image: null });
    } catch (error) {
      console.error('Error creating event:', error.message);
      //alert('Error creating event. Please try again.');
    } finally {
      
       // Alert the admin that the event was created successfully
       alert('Event created successfully!');

       // Fetch the updated list of events
       dispatch(fetchEvents());

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

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editingEvent.image_url;

      // If a new image is uploaded, upload it to Supabase
      if (updatedEvent.image) {
        const fileExt = updatedEvent.image.name.split('.').pop();
        const fileName = `${editingEvent.id}_${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('events-images')
          .upload(fileName, updatedEvent.image);

        if (error) {
          console.error('Error uploading image:', error.message);
          setLoading(false);
          return;
        }

        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/events-images/${fileName}`;
      }

      // Update the event in the database
      await dispatch(
        updateEvent({
          id: editingEvent.id,
          updatedEvent: {
            title: updatedEvent.title,
            description: updatedEvent.description,
            date: updatedEvent.date,
            image_url: imageUrl,
          },
        })
      ).unwrap();

      setEditingEvent(null);
      setUpdatedEvent({ title: '', description: '', date: '', image: null });
    } catch (error) {
      console.error('Error updating event:', error.message);
    } finally {
      setLoading(false);
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
            type="file"
            onChange={(e) => setNewEvent({ ...newEvent, image: e.target.files[0] })}
            className="w-full p-2 mb-4 border rounded"
            required
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
                <p className="text-gray-600">Created by: {event.profiles?.full_name || 'N/A'}</p>
                <button
                  onClick={() => {
                    setEditingEvent(event);
                    setUpdatedEvent({
                      title: event.title,
                      description: event.description,
                      date: event.date,
                      image: null,
                    });
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
                >
                  Edit
                </button>
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

        {editingEvent && (
          <form onSubmit={handleUpdateEvent} className="mt-8 p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Edit Event</h3>
            <input
              type="text"
              placeholder="Title"
              value={updatedEvent.title}
              onChange={(e) => setUpdatedEvent({ ...updatedEvent, title: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={updatedEvent.description}
              onChange={(e) => setUpdatedEvent({ ...updatedEvent, description: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="date"
              value={updatedEvent.date}
              onChange={(e) => setUpdatedEvent({ ...updatedEvent, date: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="file"
              onChange={(e) => setUpdatedEvent({ ...updatedEvent, image: e.target.files[0] })}
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-700"
            >
              {loading ? 'Updating...' : 'Update Event'}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
};

export default AdminHome;
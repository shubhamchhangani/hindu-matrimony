import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../redux/slices/eventSlice';
import Image from 'next/image';

const Events = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <section className="py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>
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
              <p className="text-gray-600">Created by: {event.profiles?.full_name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Events;
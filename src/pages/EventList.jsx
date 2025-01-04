import React, { useState } from 'react';
import events from '../data/events';
import noresult from '../assets/noResult.png'; // Import "no result" image
import EventModal from '../components/EventModal'; // Import the modal component
import '../styles/EventList.css'; // Import CSS file
import '../assets/discount.webp';

const EventList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEvents, setFilteredEvents] = useState(events);
    const [selectedEvent, setSelectedEvent] = useState(null); // State for selected event

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);
        const results = events.filter((event) =>
            event.name.toLowerCase().includes(searchValue)
        );
        setFilteredEvents(results);
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event); // Set the clicked event for the modal
    };

    const handleCloseModal = () => {
        setSelectedEvent(null); // Close the modal by setting the event to null
    };

    return (
        <div className="event-list">
            <h2 className='booktable'>BookMyTable</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search restaurants..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div className="event-items">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <div
                            key={event.id}
                            className="event-item"
                            onClick={() => handleEventClick(event)} // Open modal when event is clicked
                        >
                            <img src={event.image} alt={event.name} className="event-image" />
                            <p className="event-name">{event.name}</p>
                            {event.rating && (
                                <p className="event-rating">{event.rating} ⭐</p>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="no-result">
                        <img src={noresult} alt="No results found" />
                        <h2>No Results found</h2>
                    </div>
                )}
            </div>

            {/* Conditionally render the modal if an event is selected */}
            {selectedEvent && (
                <EventModal
                    event={selectedEvent}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default EventList;

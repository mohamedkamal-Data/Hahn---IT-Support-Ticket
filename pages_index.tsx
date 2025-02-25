import React, { useState } from "react";

interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  category: "Network" | "Hardware" | "Software" | "Other";
  creationDate: string;
  status: "New" | "In Progress" | "Resolved";
  auditLog: string[];
  owner: string; // To identify the ticket owner (simulated by role vs. 'Employee')
}

export default function HomePage(): JSX.Element {
  const [role, setRole] = useState<string>("Employee");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [category, setCategory] = useState<"Network" | "Hardware" | "Software" | "Other">("Network");
  const [statusFilter, setStatusFilter] = useState<"All" | "New" | "In Progress" | "Resolved">("All");
  const [searchId, setSearchId] = useState("");

  const handleCreateTicket = () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill out the title and description.");
      return;
    }

    const newTicket: Ticket = {
      id: tickets.length + 1,
      title,
      description,
      priority,
      category,
      creationDate: new Date().toLocaleString(),
      status: "New",
      auditLog: ["Ticket created."],
      owner: "Employee" // Simulate the ticket is created by an Employee
    };

    setTickets([...tickets, newTicket]);
    setTitle("");
    setDescription("");
    setPriority("Low");
    setCategory("Network");
  };

  const handleStatusChange = (id: number, newStatus: "In Progress" | "Resolved") => {
    setTickets(prev => {
      return prev.map(ticket => {
        if (ticket.id === id) {
          const updatedTicket = {
            ...ticket,
            status: newStatus,
            auditLog: [...ticket.auditLog, `Status changed to '${newStatus}'`]
          };
          return updatedTicket;
        }
        return ticket;
      });
    });
  };

  const filteredTickets = tickets.filter(ticket => {
    // Filter by role: Employees only see their tickets, IT sees all
    const roleFilter = role === "Employee" ? ticket.owner === "Employee" : true;

    // Filter by status if not 'All'
    const statusMatch = statusFilter === "All" || ticket.status === statusFilter;

    // Filter by search ID if provided (and if numeric)
    const idMatch = searchId.trim() === "" || ticket.id === Number(searchId);

    return roleFilter && statusMatch && idMatch;
  });

  return (
    <div className="min-h-screen p-4 bg-blue-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-gray-700">IT Support Ticket System</h1>
        <div className="flex space-x-4 mb-6">
          <div className="flex flex-col">
            <label className="text-gray-700">Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-gray-700"
            >
              <option value="Employee">Employee</option>
              <option value="IT Support">IT Support</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700">Filter Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-gray-300 rounded px-2 py-1 text-gray-700"
            >
              <option value="All">All</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700">Search by Ticket ID:</label>
            <input
              type="number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-gray-700"
              placeholder="Enter ID"
            />
          </div>
        </div>

        {/* Ticket Creation Form (only visible if role is Employee) */}
        {role === "Employee" && (
          <div className="bg-blue-100 p-4 rounded mb-6">
            <h2 className="text-xl font-semibold mb-2 text-blue-900">Create a New Ticket</h2>
            <div className="flex flex-col space-y-2 mb-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-gray-700"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-gray-700"
              />
              <div className="flex space-x-2">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="border border-gray-300 rounded px-2 py-1 text-gray-700"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="border border-gray-300 rounded px-2 py-1 text-gray-700"
                >
                  <option value="Network">Network</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleCreateTicket}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Ticket
            </button>
          </div>
        )}

        {/* Ticket List */}
        <div className="border border-gray-300 rounded p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Tickets</h2>
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="border-b border-gray-200 py-2">
              <div className="flex justify-between items-center">
                <div className="text-gray-800 font-medium">
                  #{ticket.id} - {ticket.title}
                </div>
                <div className="text-sm text-gray-500">{ticket.creationDate}</div>
              </div>
              <div className="text-gray-700 text-sm mb-2">Priority: {ticket.priority} | Category: {ticket.category}</div>
              <div className="mb-2 text-gray-600">{ticket.description}</div>
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-gray-700">Status:</span>
                <span className="text-gray-800">{ticket.status}</span>
                {role === "IT Support" && ticket.status !== "Resolved" && (
                  <>
                    {ticket.status !== "In Progress" && (
                      <button
                        onClick={() => handleStatusChange(ticket.id, "In Progress")}
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                      >
                        Mark In Progress
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusChange(ticket.id, "Resolved")}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Resolve
                    </button>
                  </>
                )}
              </div>
              <div className="mt-2">
                <span className="font-semibold text-gray-700">Audit Log:</span>
                <ul className="list-disc list-inside text-gray-600">
                  {ticket.auditLog.map((log, index) => (
                    <li key={index}>{log}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          {filteredTickets.length === 0 && (
            <div className="text-gray-600">No tickets found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
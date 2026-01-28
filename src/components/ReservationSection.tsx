import { useState } from 'react';
import { UtensilsCrossed, Users, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ReservationSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: '2 Guests',
    occasion: 'Select Occasion',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Table reserved successfully! We\'ll confirm your booking soon.');
    setFormData({
      name: '',
      phone: '',
      email: '',
      date: '',
      time: '',
      guests: '2 Guests',
      occasion: 'Select Occasion',
    });
  };

  const features = [
    { icon: UtensilsCrossed, title: 'Fine Dining', desc: 'Exquisite cuisine prepared by top chefs' },
    { icon: Users, title: 'Private Rooms', desc: 'Perfect for special occasions' },
    { icon: Calendar, title: 'Open Daily', desc: '11 AM - 10 PM' },
    { icon: Clock, title: 'Easy Booking', desc: 'Reservation in just a few clicks' },
  ];

  return (
    <section id="reservation" className="py-20 bg-card/50 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Content */}
          <div>
            <span className="text-primary text-sm font-medium uppercase tracking-wider">Reservations</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              Book a <span className="text-gradient">Table</span> at Our Restaurant
            </h2>
            <p className="text-muted-foreground mb-8">
              Reserve your spot for an unforgettable dining experience. Whether it's a romantic 
              dinner, a family gathering, or a business lunch, we'll make it special.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-muted-foreground text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reservation Form */}
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
            <h3 className="text-xl font-semibold text-center mb-6">Make a Reservation</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="First name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Guests</label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <option key={n} value={`${n} Guest${n > 1 ? 's' : ''}`}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Occasion</label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option>Select Occasion</option>
                    <option>Birthday</option>
                    <option>Anniversary</option>
                    <option>Business</option>
                    <option>Casual</option>
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full mt-2">
                Book Table Now
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;

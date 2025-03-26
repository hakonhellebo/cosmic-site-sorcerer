
import React from 'react';

const testimonials = [
  {
    quote: "EdPath helped me identify career paths I never considered, and I now have a clear plan for my future!",
    author: "Student",
    institution: "BI University",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    quote: "I was unsure about what job options matched my degree, but EdPath made it easy to see all my possibilities.",
    author: "Graduate",
    institution: "NTNU",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    quote: "As a new graduate, the career insights I received were exactly what I needed to take the next step in my journey.",
    author: "New Graduate",
    institution: "University of Oslo",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">What Our Users Are Saying</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Hear from students and graduates who have found their career path using EdPath.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="rounded-lg bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className="h-5 w-5 text-yellow-400" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 italic text-foreground">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="mr-4 h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.institution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

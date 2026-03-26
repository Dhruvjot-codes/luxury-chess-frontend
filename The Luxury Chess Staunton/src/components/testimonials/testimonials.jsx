import "./testimonials.css";

const testimonials = [
  {
    name: "Michael Carter",
    country: "USA",
    review:
      "Absolutely stunning craftsmanship! The chess set feels premium and the carving on every piece is incredible. Truly a masterpiece from India.",
  },
  {
    name: "Daniel Schmidt",
    country: "Germany",
    review:
      "I collect chess sets and this is one of the finest I own. The quality of the wood and detailing is outstanding.",
  },
  {
    name: "James Wilson",
    country: "UK",
    review:
      "The packaging, the quality, the finish — everything was perfect. You can clearly see the hard work of skilled artisans.",
  },
  {
    name: "Arjun Patel",
    country: "India",
    review:
      "Beautiful handcrafted chess pieces! My family loved it and it looks amazing on our table. Worth every penny.",
  },
  {
    name: "Lucas Fernandes",
    country: "Brazil",
    review:
      "This chess set exceeded my expectations. Elegant design and perfect balance in each piece. Highly recommended!",
  },
  {
  name: "James Anderson",
  country: "United Kingdom",
  review:
    "A masterpiece of craftsmanship. The detailing on the knights is incredible and the board feels truly luxurious.",
},
{
  name: "Arjun Patel",
  country: "India",
  review:
    "Beautifully handcrafted pieces with excellent finishing. It has become the centerpiece of my living room.",
},
{
  name: "Emily Carter",
  country: "United States",
  review:
    "I purchased this as a gift for my husband and he absolutely loved it. Premium quality and stunning design!",
}
];

export default function Testimonials() {
  return (
    <section  id="testimonials" className="testimonials">

      <h2 className="testimonial-title">
        What Our Customers Say
      </h2>

      <p className="testimonial-sub">
        Players and collectors around the world trust our handcrafted chess sets.
      </p>

      <div className="testimonial-container">

        {testimonials.map((item, index) => (
          <div className="testimonial-card" key={index}>
            
            <p className="review">
              "{item.review}"
            </p>

            <div className="customer">
              <h4>{item.name}</h4>
              <span>{item.country}</span>
            </div>

          </div>
        ))}

      </div>

    </section>
  );
}
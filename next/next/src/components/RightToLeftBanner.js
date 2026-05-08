/* RTL (Right to Left) Scrolling */



const RightToLeftBanner = ({ images, speed = 5000 }) => {
    return (
      <div className="rtl-banner__inner">
        <div className="rtl-banner__wrapper">
          <section className="rtl-banner__section" style={{ "--speed": `${speed}ms` }}>
            {images.map(({ id, image }) => (
              <div className="rtl-banner__image" key={id}>
                <img className="rtl-banner__img" src={image} alt={id} />
              </div>
            ))}
          </section>
          <section className="rtl-banner__section" style={{ "--speed": `${speed}ms` }}>
            {images.map(({ id, image }) => (
              <div className="rtl-banner__image" key={id}>
                <img className="rtl-banner__img" src={image} alt={id} />
              </div>
            ))}
          </section>
          <section className="rtl-banner__section" style={{ "--speed": `${speed}ms` }}>
            {images.map(({ id, image }) => (
              <div className="rtl-banner__image" key={id}>
                <img className="rtl-banner__img" src={image} alt={id} />
              </div>
            ))}
          </section>
        </div>
      </div>
    );
  };
  
  export { RightToLeftBanner };

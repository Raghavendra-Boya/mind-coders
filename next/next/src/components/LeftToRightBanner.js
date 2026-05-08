const LeftToRightBanner = ({ images, speed = 5000 }) => {
  return (
      <div className="banner-inner">
          <div className="banner-wrapper">
              {/* Repeat the images to make the loop seamless */}
              <section className="banner-section" style={{ "--speed": `${speed}ms` }}>
                  {images.map(({ id, image }) => (
                      <div className="image" key={id}>
                          <img src={image} alt={id} />
                      </div>
                  ))}
              </section>
              <section className="banner-section" style={{ "--speed": `${speed}ms` }}>
                  {images.map(({ id, image }) => (
                      <div className="image" key={id}>
                          <img src={image} alt={id} />
                      </div>
                  ))}
              </section>
          </div>
      </div>
  );
};

export { LeftToRightBanner };

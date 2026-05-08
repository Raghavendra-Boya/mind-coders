import Image from "next/image";

const Card = ({ title, imgSrc, bgColor, btnColor }) => {
  return (
    <div className={`${bgColor} rounded-lg shadow-lg p-6 text-center grid-lines h-80 flex flex-col justify-between`}>
      <div>
        <div className="mb-4">
          <Image src={imgSrc} alt={title} width={64} height={64} className="mx-auto" />
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">{title}</h2>
      </div>
      <button className={`${btnColor} text-gray-800 font-semibold py-2 px-4 rounded-full inline-flex items-center`}> 
        <span>Click here</span>
        <i className="fas fa-arrow-right ml-2"></i>
      </button>
    </div>
  );
};
export default Card;
import React from 'react';

const BuyMeACoffeeButton = () => {
  return (
    <div className='coffeeBtn'>
        <a
      href="https://www.buymeacoffee.com/dhaval079"
      target="_blank"
      rel="noopener noreferrer" // Add for security
    >
      <img
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        alt="Buy Me A Coffee"
        style={{ backgroundColor :'black', height: '50px', width: '180px' }}
      />
    </a>
    </div>
  );
};

export default BuyMeACoffeeButton;
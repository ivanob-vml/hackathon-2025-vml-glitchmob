import React from 'react';

const WelcomeComponent: React.FC = () => {
    return (
    <div className="flex justify-start items-center flex-col gap-[19px]">
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M82.5914 37.4834C82.9456 37.1435 83.1868 36.7102 83.2846 36.2385C83.3824 35.7668 83.3323 35.2778 83.1407 34.8334C82.949 34.3891 82.6245 34.0093 82.2081 33.7423C81.7918 33.4752 81.3023 33.3329 80.8017 33.3333H15.0316C14.531 33.3329 14.0415 33.4752 13.6252 33.7423C13.2088 34.0093 12.8843 34.3891 12.6927 34.8334C12.501 35.2778 12.4509 35.7668 12.5487 36.2385C12.6465 36.7102 12.8877 37.1435 13.2419 37.4834L45.387 68.3667V86.8055H35.2686C34.5977 86.8055 33.9543 87.0616 33.4799 87.5174C33.0055 87.9732 32.7389 88.5914 32.7389 89.236C32.7389 89.8807 33.0055 90.4989 33.4799 90.9547C33.9543 91.4105 34.5977 91.6666 35.2686 91.6666H60.5648C61.2357 91.6666 61.8791 91.4105 62.3535 90.9547C62.8279 90.4989 63.0944 89.8807 63.0944 89.236C63.0944 88.5914 62.8279 87.9732 62.3535 87.5174C61.8791 87.0616 61.2357 86.8055 60.5648 86.8055H50.4463V68.3667L82.5914 37.4834ZM74.6864 38.1944L69.6271 43.0555H26.1967L21.1375 38.1944H74.6864Z"
          fill="#4927AF" />
        <path
          d="M72.7023 27.8701C72.7056 28.3386 72.5454 28.7966 72.2439 29.1809C71.9423 29.5653 71.5141 29.8571 71.0183 30.0162L62.6825 32.7543L59.6119 40.1696C59.4301 40.6087 59.1011 40.9877 58.6694 41.2554C58.2376 41.5231 57.7239 41.6666 57.1975 41.6666C56.6711 41.6666 56.1573 41.5231 55.7256 41.2554C55.2939 40.9877 54.9649 40.6087 54.783 40.1696L51.6931 32.7543L43.3508 30.0249C42.8568 29.8632 42.4304 29.5708 42.1293 29.187C41.8282 28.8032 41.6667 28.3466 41.6667 27.8787C41.6667 27.4108 41.8282 26.9541 42.1293 26.5703C42.4304 26.1866 42.8568 25.8941 43.3508 25.7325L51.6931 22.9859L54.7636 15.5705C54.9455 15.1314 55.2745 14.7524 55.7062 14.4847C56.138 14.2171 56.6517 14.0735 57.1781 14.0735C57.7045 14.0735 58.2182 14.2171 58.65 14.4847C59.0817 14.7524 59.4107 15.1314 59.5925 15.5705L62.6825 22.9859L71.0248 25.7153C71.521 25.8759 71.9488 26.1694 72.2493 26.5554C72.5498 26.9413 72.7081 27.4007 72.7023 27.8701ZM63.6522 14.0794H66.2379V16.3778C66.2379 16.6826 66.3741 16.9749 66.6166 17.1904C66.8591 17.406 67.1879 17.527 67.5308 17.527C67.8737 17.527 68.2025 17.406 68.445 17.1904C68.6875 16.9749 68.8237 16.6826 68.8237 16.3778V14.0794H71.4094C71.7523 14.0794 72.0812 13.9583 72.3236 13.7428C72.5661 13.5273 72.7023 13.2349 72.7023 12.9301C72.7023 12.6254 72.5661 12.333 72.3236 12.1175C72.0812 11.902 71.7523 11.7809 71.4094 11.7809H68.8237V9.48248C68.8237 9.17768 68.6875 8.88537 68.445 8.66985C68.2025 8.45433 67.8737 8.33325 67.5308 8.33325C67.1879 8.33325 66.8591 8.45433 66.6166 8.66985C66.3741 8.88537 66.2379 9.17768 66.2379 9.48248V11.7809H63.6522C63.3093 11.7809 62.9804 11.902 62.738 12.1175C62.4955 12.333 62.3593 12.6254 62.3593 12.9301C62.3593 13.2349 62.4955 13.5273 62.738 13.7428C62.9804 13.9583 63.3093 14.0794 63.6522 14.0794ZM77.8738 18.6763H76.5809V17.527C76.5809 17.2223 76.4447 16.9299 76.2023 16.7144C75.9598 16.4989 75.631 16.3778 75.2881 16.3778C74.9452 16.3778 74.6163 16.4989 74.3739 16.7144C74.1314 16.9299 73.9952 17.2223 73.9952 17.527V18.6763H72.7023C72.3594 18.6763 72.0306 18.7973 71.7881 19.0129C71.5456 19.2284 71.4094 19.5207 71.4094 19.8255C71.4094 20.1303 71.5456 20.4226 71.7881 20.6381C72.0306 20.8536 72.3594 20.9747 72.7023 20.9747H73.9952V22.1239C73.9952 22.4287 74.1314 22.721 74.3739 22.9366C74.6163 23.1521 74.9452 23.2732 75.2881 23.2732C75.631 23.2732 75.9598 23.1521 76.2023 22.9366C76.4447 22.721 76.5809 22.4287 76.5809 22.1239V20.9747H77.8738C78.2167 20.9747 78.5456 20.8536 78.788 20.6381C79.0305 20.4226 79.1667 20.1303 79.1667 19.8255C79.1667 19.5207 79.0305 19.2284 78.788 19.0129C78.5456 18.7973 78.2167 18.6763 77.8738 18.6763Z"
          fill="#4927AF" />
      </svg>
      <p
        className="self-stretch text-[#000000] text-2xl font-['Inter'] text-center font-bold">
        'Ello me old china!. What brings ya here today?
      </p>
    </div>
  );
};

export default WelcomeComponent;

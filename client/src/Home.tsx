import React, { useState, useEffect } from "react";

const Home: React.FC = () => {
  return (
    <div style={{ padding: "0px 15px 0px 15px" }}>
      <h1 style={{ margin: "0px 0px 10px 0px", textAlign: "center" }}>
        Lorem Ipsum Text
      </h1>
      <div style={{ margin: "0px 0px 10px 0px", textAlign: "center" }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
        molestie magna risus, sit amet hendrerit augue maximus et. Nam
        fermentum, mi nec posuere malesuada, massa orci gravida enim, at euismod
        arcu ante ac enim. Donec rutrum tempus molestie. Quisque bibendum
        bibendum aliquet. Morbi nec mauris scelerisque, ultrices massa vel,
        accumsan dolor. Etiam pulvinar dignissim ipsum, nec consequat massa
        finibus vitae. Etiam sit amet augue sodales, auctor metus accumsan,
        fringilla ex. Integer et sodalesorci. Integer eleifend eu tellus et
        consectetur. Aliquam mollis vehicula nulla, eget consectetur nunc.
      </div>
      <div>
        <button>Click here</button>
      </div>
    </div>
  );
};
export default Home;

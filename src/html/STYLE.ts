export default `
    <style>
      /* Style the tab */
      .tab {
        overflow: hidden;
        border: 1px solid #ccc;
        background-color: #f1f1f1;
        margin: 40px 20px;
      }
  
      /* Style the buttons that are used to open the tab content */
      .tab button {
        background-color: inherit;
        float: left;
        border: none;
        outline: none;
        cursor: pointer;
        padding: 14px 16px;
        transition: 0.3s;
      }
  
      /* Change background color of buttons on hover */
      .tab button:hover {
        background-color: #ddd;
      }
  
      /* Create an active/current tablink class */
      .tab button.active {
        background-color: #ccc;
      }
  
      /* Style the tab content */
      .tabcontent {
        display: none;
        padding: 6px 12px;
        border: 1px solid #ccc;
        border-top: none;
      }
      .Maintablinks {
        font-size: 150%;
        font-weight:bold;
      }
      .copyright {
        text-align: center;
        padding: 2%;
      }
      body {
        margin: 0 auto;
      }
      .container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin: 0 auto;
        padding: 0 0.5rem 1rem;
        position: relative;
        transition: all 2s;
      }
      .container > div.item {
        align-items: self-start;
        justify-content: center;
        background-color: hsl(133, 100%, 80%);
        display: flex;
        flex: 0 1 auto;
        outline: 3px solid green;
        margin: 0.5rem;
        padding: 0.5rem;
        position: relative;
          min-height: 100px;
          width: 150px;
        transition: top 0.5s, left 0.5s;
        border-radius: 10px;
        cursor: pointer;
      }
      .poster {
        border-radius: 2%;
      }
    </style>
    `;

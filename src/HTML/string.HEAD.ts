export default function HEAD(): String {
  return `
    <head>
      ${STYLE()}
    </head>
    `;
}
function STYLE(): string {
  return `
    <style>
      /* Style the tab */
      img {
        padding-top: 8px;
        width: 100%;
      }

      .tab {
        overflow: hidden;
        border: 1px solid #ccc;
        background-color: #f1f1f1;
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
        display: flex;
        flex-wrap: wrap;
        justify-items: start;
        padding: 15px;
      }
      .tabcontent > div {
        width: 150px;
        background-color: #e7e7e7;
        margin: 10px;
        padding: 20px;
        font-size: 20px;
        border-radius: 20px;
      }
      .Maintablinks {
        font-size: 150%;
        font-weight:bold;
      }
      .copyright {
        text-align: center;
        padding: 2%;
      }
      
    </style>
    `;
}

export default (LATESTTVDate: string, LATESTMOVIEDate: string): string => {
  return `
  <script>
    function openTab(evt, cityName) {
      // Declare all variables
      var i, tabcontent, tablinks;
      var skip = false;
      // Get all elements with class="tabcontent" and hide them
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      if(evt &&  !evt.currentTarget.className.includes("tablinks") && evt.currentTarget.className.includes("active")) skip = true;

      // Get all elements with class="tablinks" and remove the class "active"
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
      }
      if(skip) return;


      // Show the current tab, and add an "active" class to the button that opened the tab
      document.getElementById(cityName).style.display = "block";
      if(evt)
        evt.currentTarget.className += " active";
    }
    function openMainTab(evt, cityName) {
      // Declare all variables
      var i, tabcontent, tablinks;
      var skip = false;
      // Get all elements with class="tabcontent" and hide them
      tabcontent = document.getElementsByClassName("Maintabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      if(evt && !evt.currentTarget.className.includes("Maintablinks") &&  evt.currentTarget.className.includes("active")) skip = true;

      // Get all elements with class="tablinks" and remove the class "active"
      tablinks = document.getElementsByClassName("Maintablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      if(skip) return;
      // Show the current tab, and add an "active" class to the button that opened the tab
      document.getElementById(cityName).style.display = "block";
      if(evt)
        evt.currentTarget.className += " active";
      openTab(event, (cityName === 'tv'?'${LATESTTVDate}':'${LATESTMOVIEDate}'))
    }
    openMainTab(event, 'tv');
    openTab(event,${LATESTTVDate})
  </script>
  `;
};

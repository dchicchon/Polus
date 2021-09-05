<template>
  <div class="main">
    <h2 class="page-title">Updates</h2>
    <div class="update-details">
      <div>
        <h4 style="margin: 0%">Update 1.7.1</h4>
        <ul style="margin-top: 0; padding-inline-start: 20px">
          <li>Bug fixes for dragging entries from previous version</li>
          <li>
            Bring icons into polus app instead of relying on internet connection
          </li>
        </ul>
      </div>
      <div>
        <h4 style="margin: 0%">Update 1.7</h4>
        <ul style="margin-top: 0; padding-inline-start: 20px">
          <li>Upload photos from your device as your background</li>
          <li>Add times to entries and get notifications</li>
          <li>Add icons to entries</li>
        </ul>
      </div>
      <div>
        <h4 style="margin: 0%">Update 1.5</h4>
        <ul style="margin-top: 0; padding-inline-start: 20px">
          <li>Edit and add color to entries</li>
          <li>Fixed sizing with entries</li>
          <li>Popup that now shows an options, updates, and account tab</li>
          <li>
            Several new options that include removing the clock, date and the
            option to make Polus your new tab or not
          </li>
          <li>Add any background photo you want from unsplash!</li>
        </ul>
      </div>
      Please feel free to send us any additional suggestions and thank you for
      your feedback!
      <br />
      - Danny
    </div>
  </div>
</template>

<script>

export default {};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
}
.page-title {
  height: 10%;
}

.update-details {
  overflow: auto;
  height: 90%;
  &::-webkit-scrollbar {
    width: 3px;
    height: 2px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: none;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}
</style>

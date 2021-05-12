<template>
  <div>
    <div class="container">
      <h2 class="page-title">Options</h2>
      <Toggle
        :key="1"
        :toggleItem="toggleItem"
        :description="'Change Photo Daily'"
        :name="'changePhoto'"
        :currentValue="userSettings['changePhoto']"
      />
      <Toggle
        :key="2"
        :toggleItem="toggleItem"
        :name="'newTab'"
        :currentValue="userSettings['newTab']"
        :description="'Default New Tab'"
      />

      <div>
        Select Photo from
        <span>
          <a
            href="https://unsplash.com/"
            target="_blank"
            rel="noopener noreferrer"
            >Unsplash</a
          ></span
        >
        <input
          id="photoURL"
          type="text"
          placeholder="https://unsplash.com/photos/NuBvAE6VfSM"
          v-model="photoLink"
        />
      </div>
      <button @click="submitPhoto" id="submitPhoto">Submit</button>
    </div>

    <ul id="popup-links">
      <li class="active-popup">
        <a href="">Options</a>
      </li>
      <li>
        <a href="">Updates</a>
      </li>
      <li>
        <a href="">Account</a>
      </li>
    </ul>
  </div>
</template>

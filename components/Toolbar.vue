<template>
  <div class="toolbar">
    <div class="tab_container">
      <div class="tab">
        <v-icon>mdi-magnify</v-icon>
        <span style="padding: 4px; overflow: hidden;">Selection</span>
      </div>
      <div class="tab_box_L1"></div>
      <div class="tab_box_L2"></div>
      <div class="tab_box_R1"></div>
      <div class="tab_box_R2"></div>
    </div>
    <div class="navi">
      <div class="btn_wrapper"><v-icon style="color: #d1d5db;">mdi-arrow-left</v-icon></div>
      <div class="btn_wrapper"><v-icon style="color: #d1d5db;">mdi-arrow-right</v-icon></div>
      <div class="btn_wrapper"><v-icon style="color: #d1d5db;">mdi-refresh</v-icon></div>
    </div>
  </div>
</template>

<style>
.toolbar {
  width: 100%;
  height: 100%;
  background-color: #e5e7eb;
  border-bottom: #e5e7eb 1px solid;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
}

.tab {
  background-color: white;
  position: absolute;
  bottom: 0;
  left: 12px;
  width: calc(100% - 24px);
  height: 100%;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 8px;
  color: #4b5563;
  display: flex;
  justify-content: start;
  align-items: center;
  font-size: 16px;
  user-select: none;
}

.btn_wrapper {
  margin-right: 2px;
  padding: 6px;
  border-radius: 9999px;
  /* color: #4b5563; */
  color: #d1d5db;
}

/* .btn_wrapper:hover {
  background-color: #f3f4f6;
}

.btn_wrapper:active {
  background-color: #e5e7eb;
} */

.navi {
  width: 100%;
  height: 50%;
  background-color: white;
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 8px;
}

.tab_container {
  width: 20%;
  height: calc(50% - 8px);
  position: relative;
}

.tab_box_L1,
.tab_box_L2,
.tab_box_R1,
.tab_box_R2 {
  width: 12px;
  height: 100%;
}

.tab_box_L1,
.tab_box_L2 {
  position: absolute;
  bottom: 0;
  left: 0;
}

.tab_box_R1,
.tab_box_R2 {
  position: absolute;
  bottom: 0;
  right: 0;
}

.tab_box_L1,
.tab_box_R1 {
  background-color: white;
  z-index: 1;
}

.tab_box_L2,
.tab_box_R2 {
  background-color: #e5e7eb;
  z-index: 2;
}

.tab_box_L2 {
  border-bottom-right-radius: 8px;
}

.tab_box_R2 {
  border-bottom-left-radius: 8px;
}
</style>

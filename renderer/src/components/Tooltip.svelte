<script>
  export let text = "";
</script>

<style>
  .tooltip-container {
    position: relative;
    display: inline-block;
  }

  .tooltip-container .tooltip-icon,
  .tooltip-container .tooltip-data {
    background-color: var(--main-background);
    border: 1px solid var(--main-secondary);
  }
  .tooltip-container .tooltip-icon {
    border-radius: 50%;
    width: 16px;
    height: 16px;
  }
  .tooltip-container .tooltip-icon__img {
    width: 10px;
    height: 10px;
  }
  .tooltip-container .tooltip-data {
    visibility: hidden;
    position: absolute;
    top: -10px;
    width: 150px;
    height: 70px;
    transform: translate(-50%, -100%);
    font-size: 14px;
    text-align: center;
  }
  .tooltip-container:hover .tooltip-data {
    visibility: visible;
  }
</style>

<div class="tooltip-container">
  <div class="tooltip-icon flex-center">
    <img src="./images/icons/i.svg" alt="Информация" class="tooltip-icon__img" />
  </div>
  <div role="tooltip" class="tooltip-data flex-center">{text}</div>
</div>

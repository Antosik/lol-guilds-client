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
    color: #f5f0df;
    background-color: #161614;
    border: 2px solid #c2aa70;
  }
  .tooltip-container .tooltip-icon {
    border-radius: 50%;
    width: 14px;
    height: 14px;
    font-size: 10px;
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
  <div class="tooltip-icon flex-center">i</div>
  <div role="tooltip" class="tooltip-data flex-center">{text}</div>
</div>

<style>
  .loading-spinner {
    font-size: 10px;
    text-indent: -9999em;
    border-radius: 50%;
    background: #f5f0df;
    background: -moz-linear-gradient(
      left,
      #f5f0df 10%,
      rgba(245, 240, 233, 0) 42%
    );
    background: -webkit-linear-gradient(
      left,
      #f5f0df 10%,
      rgba(245, 240, 233, 0) 42%
    );
    background: -o-linear-gradient(
      left,
      #f5f0df 10%,
      rgba(245, 240, 233, 0) 42%
    );
    background: -ms-linear-gradient(
      left,
      #f5f0df 10%,
      rgba(245, 240, 233, 0) 42%
    );
    background: linear-gradient(
      to right,
      #f5f0df 10%,
      rgba(245, 240, 233, 0) 42%
    );
    position: relative;
    animation: loading 1.4s infinite linear;
    transform: translateZ(0);
  }
  .loading-spinner:before {
    width: 50%;
    height: 50%;
    background: #f5f0df;
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
  }
  .loading-spinner:after {
    background: #161614;
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: "";
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

<div class="loading-spinner" />

<script lang="ts">
</script>

<main>
  <div class="obj"></div>
</main>

<style>
  .obj {
    width: 50px;
    height: 50px;
    background-color: red;

    animation: anim-name var(--duration-anim-name) ease infinite;
    opacity: 1;
  }

  @anim-step step-red {
      background-color: red;
  }

  @anim-step step-blue {
      background-color: blue;
  }

  @anim anim-name {
    @step 1s {
      background-color: red;
    }
    @step 0.5s {
      background-color: blue;
    }
    @step 1.5s {
      background-color: cyan;
    }
  }
</style>

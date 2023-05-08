<script setup>
import FeedComponent from '@/components/FeedComponent.vue';



</script>

<template>
  <main>
    <div class="home" >
      <img src="../assets/InManga.png" alt="">
  
      <div class="content">
        <div class="logo"> InManga </div>
        <div class="slogan"> Don't just read manga, experience it with us </div>
  
      </div>
    </div>
    
    <FeedComponent />
  </main>
</template>

<style lang="scss" scoped>
  
.home{
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    position: absolute;
  }

  .content {
    width: 100%;
    height: 100%;
    background: #00000083;
    padding: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 1;
    .logo {
      font-size: 70px ;
      padding: 1.5rem;
      background:white ;
      width: fit-content;
      color:  #000;
      border-top-right-radius: 2rem;
      box-shadow: 2px 2px 2px 2px rgba(0,0,0,.4) ;      
    }
    .slogan {
      font-size: 30px ;
      padding: 1.5rem;
      background: black;
      width: fit-content;
      color: #eee;
      border-bottom-left-radius: 2rem;
      border-top-right-radius: 2rem;
      box-shadow: 2px 2px 2px 2px rgba(255,255,255,.4) ;
    }
  }
}

@media (max-width: 800px){
.home{
  justify-content: left;
  .content {
    .logo {
      font-size: 40px;
    }
    .slogan{
      font-size: 20px;
    }
  }
}


}
@media (max-width: 517px){
.home{
  justify-content: left;
  .content {
    padding-left: 1rem;
    .logo {
      font-size: 30px;
      padding: 1rem;
    }
    .slogan{
      padding: 1rem;
      font-size: 18px;
    }
  }
}


}  



</style>
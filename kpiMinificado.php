<?php 
  session_start();
  session_register("session");
  include "../../callcenter/cc_libcallcenter.php";
  if(!isset($session)) {header ("Location:".HTTPHOST.DOCROOT."cc_login.php"); exit;}

  $voltar = "";
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>GAMEK Minificado</title>
  <!-- Bootstrap -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
  integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
  <link rel="stylesheet" href="kpiMinificado.css">
  <script src="https://www.unpkg.com/vue"></script>
  <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</head>
<!-- <body> -->
  <div id="container-simplificacao">
    <div class="button" v-on:click="toggleModal()">
      <div class="svg" v-html="svgAvatar"></div>
      <div class="icone-desempenho">
        <i :class="estadoModal == false ? 'fas fa-chart-line' : 'fas fa-times'"></i>
      </div>
    </div>
    <div class="container-modal">
      <div class="conteudo-modal d-none">
        <div class="titulo-modal">
          <h1> 
            GAMEK Resumo 
            <a href="https://linux03/kpi/" target="_blank" title="Abrir GAMEK">
              <i class="fas fa-external-link-alt"></i>
            </a>
          </h1>
        </div>
        <hr class="separador-modal">
        <div id="container-graficos">
          <div id="graficos">  </div>
        </div>
        <!-- <hr class="separador-modal"> -->
        <div class="container-detalhes">
          <i class="fas fa-robot"></i>
          <div id="carousel-mensagens" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">
            <template v-if="haMensagens">
              <div class="item" :class="index == 0 ? 'active' :  ''" v-for="(msg, index) in arrMensagens" :key="index">
                <p>{{ msg.mensagem }}</p>
              </div>
            </template>
            <div v-else>
              <div class="item active">
                <p> Não há mensagens para mostrar </p>
              </div>
            </div>
            <!-- <a class="left carousel-control controles" href="#myCarousel" data-slide="prev">
              <span class="glyphicon glyphicon-chevron-left"></span>
              <span class="sr-only">Anterior</span>
            </a>
            <a class="right carousel-control controles" href="#myCarousel" data-slide="next">
              <span class="glyphicon glyphicon-chevron-right"></span>
              <span class="sr-only">Próximo</span>
            </a> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
<script src="kpiMinificado.js"></script>
</html>


<!-- v8 cabecalho || v8 principal (esse) -->
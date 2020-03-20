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
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
  integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
  <link rel="stylesheet" href="kpiMinificado.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script src="https://www.unpkg.com/vue"></script>
  <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</head>
<body>
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
          <h1> Desempenho <i class="fas fa-chart-line"></i> </h1>
        </div>
        <hr class="separador-modal">
        <div id="container-graficos">
          <div id="graficos">  </div>
        </div>
        <hr class="separador-modal">
        <div class="container-detalhes">
          <a href="https://linux03/kpi/" target="_blank" title="Abrir GAMEK"> Ver gráficos mais detalhados <i class="fas fa-external-link-alt"></i> </a>
        </div>
      </div>
    </div>
  </div>
</body>
<script src="kpiMinificado.js"></script>
</html>

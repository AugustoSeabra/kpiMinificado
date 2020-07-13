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
  <script src="jquery.js"></script>
  <link rel="stylesheet" href="bootstrap.min.css">
  <script src="bootstrap.min.js"></script>
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
  integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
  <link rel="stylesheet" href="kpiMinificado.css">
  <script src="vue.js"></script>
  <script src="apexcharts.js"></script>
</head>
<!-- <body> -->
  <div id="container-simplificacao" :class="!mudarClasse ? 'baixo' : 'cima'">
    <div class="button" v-on:click="toggleModal()">
      <div class="svg" v-html="svgAvatar"></div>
      <div class="icone-desempenho">
        <i :class="estadoModal == false ? 'fas fa-chart-line' : 'fas fa-times'"></i>
      </div>
    </div>
    <div class="alterar-posicao" v-if="!estadoModal">
      <i class="fas fa-long-arrow-alt-up" :title="tituloFlecha" :class="mudarClasse ? 'rotate': ''" id="i-alterar" v-on:click="alterarPosicao($event)"></i>
    </div>
    <div class="container-modal">
      <div class="conteudo-modal d-none">
        <div class="titulo-modal">
          <h1>
            GAMEK Resumo
            <a class="link-gamek" href="javascript:abreSeed()" title="Abrir GAMEK">
              <i class="fas fa-external-link-alt"></i>
            </a>
            <!-- <a href="https://linux03/kpi/" target="_blank" title="Abrir GAMEK"> -->
            <!-- </a> -->
          </h1>
        </div>
        <!-- <hr class="separador-modal"> -->
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
                <i class="far fa-check-square pointer" v-on:click="marcarMsgLida(msg, index, $event)" :title="txtLido"></i>
                <p>{{ msg.mensagem }}</p>
              </div>
            </template>
            <div v-else>
              <div class="item active sem-mensagens">
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
<?
  if ($session["representante"] == "URANET") {
    $strLoginSimulado = "&login_simulado=S";
  }
?>
<script language="javascript">
  var janelaSeed = {};
  janelaSeed.closed = true;
  function abreSeed() {
    strHelpOptions =  "location=no";
    strHelpOptions += ",toolbar=no";
    strHelpOptions += ",titlebar=no";
    strHelpOptions += ",menubar=no";
    strHelpOptions += ",status=no";
    strHelpOptions += ",scrollbars=yes";
    strHelpOptions += ",resizable=1";
    strHelpOptions += ",width=" + screen.availWidth;
    strHelpOptions += ",height=" + screen.availHeight;
    if (janelaSeed.closed) {
      janelaSeed = window.open('/kpi/?mku=MKUjB2H85eD1pSBSDTl2MfZrUwBbD4RVx31vRWYuqqgoaitHnrT2xzwp0L05nMwh8acMKEwC0wwim4l5wwCuXMpJnESWu8wwim4l5wwq10=<?echo $strLoginSimulado;?>', 'NV_401', strHelpOptions);
    } else {
      janelaSeed.focus();
    }

  }
</script>
<script src="kpiMinificado.js"></script>
</html>
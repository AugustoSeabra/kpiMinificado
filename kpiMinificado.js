  let vm = new Vue({
    el: '#container-simplificacao',
    data(){
      return{
        estadoModal: false,
        svgAvatar: '',
        dadosTabelaDestaqueS: [],
        dadosTabelaDestaqueN: [],
        valoresMeta: [],
        metaFormatada: [],
        valoresVoce: [],
        voceFormatada: [],
        valoresPrimeiro: [],
        primeiroFormatada: [],
        todosTitulos: [],
        titulo: '',
        arrMensagens: [],
        haMensagens: false,
        primeiraReqMsg: true,
        intervaloReqMsg: 600000,
        txtLido: 'Marcar como lido',
        posicaoPadraoKPI: true,
        tituloFlecha: 'Subir GAMEK Minificado',
        mudarClasse: false
      }
    },
    methods: {
      toggleModal() {
        if(this.estadoModal == false){
          this.anima('abrir')
          this.estadoModal = true
          top.postMessage('abrir', this.getBaseUrlApi())
          if(!this.posicaoPadraoKPI){
            document.querySelector('#container-simplificacao').classList.remove('cima')
            document.querySelector('#container-simplificacao').classList.add('cima-aberto')
          }
        }else{
          this.anima('fechar')
          this.estadoModal = false
          top.postMessage('fechar', this.getBaseUrlApi())
          if(!this.posicaoPadraoKPI){
            document.querySelector('#container-simplificacao').classList.remove('cima-aberto')
            document.querySelector('#container-simplificacao').classList.add('cima')
          }
        }
      },
      anima(acao){
        if(acao == 'abrir'){
          // document.querySelector('.button').classList.remove('mostraPerfil')
          // document.querySelector('.container-modal').classList.remove('fechaModal')

          setTimeout(() => { document.querySelector('.conteudo-modal').classList.remove('d-none') }, 510)

          document.querySelector('.icone-desempenho').classList.add('diminuiIcone')
          document.querySelector('.svg').classList.add('diminuiSvg')
          document.querySelector('.button').classList.add('escondePerfil')
          document.querySelector('.container-modal').classList.add('abreModal')
          document.querySelector('.conteudo-modal').classList.add('apareceConteudo')
        }else{
          document.querySelector('.icone-desempenho').classList.remove('diminuiIcone')
          document.querySelector('.svg').classList.remove('diminuiSvg')
          document.querySelector('.button').classList.remove('escondePerfil')
          document.querySelector('.container-modal').classList.remove('abreModal')
          document.querySelector('.conteudo-modal').classList.remove('apareceConteudo')

          document.querySelector('.conteudo-modal').classList.add('d-none')
        }
      },
      ajustaViewBox(){

        let svg = document.querySelector('.svg svg')

        svg.setAttribute('viewBox', '0 0 264 320')
        svg.setAttribute('height', '220px')
      },
      requisicaoSvgAvatar(urlAvatar){

        if(!urlAvatar){
          urlAvatar = 'https://avataaars.io/?avatarStyle=Circle&topType=NoHair&accessoriesType=Blank&hairColor=Black&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Tanned'
        }

        let objAvatar = {
          url: urlAvatar
        }

        objAvatar = JSON.stringify(objAvatar)

        $.post(`${this.getBaseUrlApi()}webservices/intergrallapi/kpi/avatar/request`,
        objAvatar,
        (response) => {
          if(response.status == 'OK'){
            this.svgAvatar = response.dados
            setTimeout(() => {this.ajustaViewBox()}, 100)
          }else{
            console.log('Requisicao ao kpi/avatar falhou, a pagina nao sera renderizada')
            document.querySelector('#container-simplificacao').remove()
          }
        })
      },
      requisicaoOpe(){
        $.post(`${this.getBaseUrlApi()}webservices/intergrallapi/kpi/operacional`,
        '',
        (response) => {
          if(response.status == 'OK'){
            this.requisicaoSvgAvatar(response.operador.avatar)
            this.dadosTabelaDestaqueS = response.kpis.filter(this.filtraTabelaDestaqueS)
            this.dadosTabelaDestaqueN = response.kpis.filter(this.filtraTabelaDestaqueN)

            this.titulo = 'Indicadores do Mês'
            if(!this.verificaGrafVazio(this.dadosTabelaDestaqueS)){
              this.filtraValores(this.dadosTabelaDestaqueS)
            }else{
              this.filtraValores(this.dadosTabelaDestaqueN)
            }
          }else{
            console.log('Requisicao ao kpi/operacional falhou, a pagina nao sera renderizada')
            document.querySelector('#container-simplificacao').remove()
          }
        })
      },
      requisicaoMensagens(){
        $.get(`${this.getBaseUrlApi()}webservices/intergrall-api/kpi/msg/lista`,
        (response, status) => {
          if(status !== 'success'){
            console.log('Requisição Mensagens Falhou!')
            return
          }

          if(response.status == 'OK'){
            
            console.log(this.arrMensagens)

            this.arrMensagens = response.mensagens
            if(this.arrMensagens.length){
              this.haMensagens = true
              top.postMessage('haMensagens', this.getBaseUrlApi())
            }else{
              this.haMensagens = false
              top.postMessage('naoHaMensagens', this.getBaseUrlApi())
            }

          }else{
            // console.log('Requisição Mensagem Status NOK: ', response)
            this.haMensagens = false
          }
        })
      },
      marcarMsgLida(msg, indice, elem){
        let icone = elem.currentTarget

        let idMsg = msg.id

        let objMsg = {
          id: idMsg
        }

        objMsg = JSON.stringify(objMsg)

        $.post(`${this.getBaseUrlApi()}webservices/intergrall-api/kpi/msg/lida`,
        objMsg,
        (response, status) => {
          if(status !== 'success'){
            console.log('Requisição marcar como lida Falhou!')
            alert('Não foi possível completar a requisição')
            return
          }

          if(response.status == 'OK'){

            icone.classList.remove('far')
            icone.classList.add('fas')
            this.requisicaoMensagens()

          }else{
            console.log('Marcar como lida Status NOK')
            alert('Não foi possível marcar como lida')
          }
        })

      },
      getBaseUrlApi(){
        if(window.location.hostname == 'localhost' || window.location.hostname == '192.168.204.126'){
          return 'https://linux03/'
        }else{
          return 'https://'+window.location.hostname+'/'
        }
      },
      criaGrafico(){  
        var options = {
          series: [{name: 'Você', data: this.valoresVoce}, {name: 'Meta', data: this.valoresMeta}, {name: '1º Colocado', data: this.valoresPrimeiro}],
          colors: ["#FB8C00", "#0367A6", "#009921"],
          chart: {
            width: '100%',
            height: '100%',
            type: 'bar',
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          dataLabels: {
            enabled: false,
            // enabledOnSeries: vm.teste()
          },
          stroke:{
            width: 1,
            colors: ['#FFF']
          },
          title: {
            text: this.titulo
          },
          legend: {
            position: 'top',
          },
          xaxis: {
            categories: this.todosTitulos,
            labels: {
              show: false
            }
          },
          tooltip: {
            enabled: true,
            followCursor: true,
            style: {
              fontSize: '12px',
            },
            onDatasetHover: {
              highlightDataSeries: true,
            },
            y: {
              formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
                if(seriesIndex == '0'){
                  if(vm.voceFormatada[dataPointIndex]){
                    return vm.voceFormatada[dataPointIndex]
                  }else{
                    return '0'
                  }
                }else if(seriesIndex == '1'){
                  if(vm.metaFormatada[dataPointIndex]){
                    return vm.metaFormatada[dataPointIndex]
                  }else{
                    return '0'
                  }
                }else{
                  if(vm.primeiroFormatada[dataPointIndex]){
                    return vm.primeiroFormatada[dataPointIndex]
                  }else{
                    return '0'
                  }
                }
                // return value
              },
              title: {
                  formatter: (seriesName) => seriesName,
              },
            },
            marker: {
              show: true,
            },
            items: {
              display: "flex",
            },
            fixed: {
              enabled: false,
              position: 'topRight',
              offsetX: 0,
              offsetY: 0,
            },
          }
        };

        var chart = new ApexCharts(document.querySelector('#graficos'), options);
        chart.render();

        this.cont = 1
      },
      filtraTabelaDestaqueS(value){
        if(value.titulo == '' ||  value.status == ''){
          return
        }else if(value.destaque == 'SIM'){
          // if(value.status == 'S' || value.m0 == '' || value.top1_real == '' || value.top1 == '' || value.meta == ''){
          //   value.meta = 0
          //   value.m0 = 0
          //   value.top1_real = 0
          //   value.top1 = 0
          //   value.ranking = 0
          // }
          return value
        }
      },
      filtraTabelaDestaqueN(value){
        if(value.titulo == '' ||  value.status == ''){
          return
        }else if(value.destaque !== 'SIM'){
          // Caso precise zerar os que não possue destaque
          // if(value.status == 'S' || value.m0 == '' || value.top1_real == '' || value.top1 == '' || value.meta == ''){
          //   // return
          //   value.meta = 0
          //   value.m0 = 0
          //   value.top1_real = 0
          //   value.top1 = 0
          //   value.ranking = 0
          // }
          return value
        }
      },
      verificaGrafVazio(array){
        if(array.length == 0){
          return true
        }else{
          return false
        }
      },
      filtraValores(array){
        if(!this.verificaGrafVazio(array)){

          for(let i = 0; i < array.length; i++){
            this.valoresMeta.push(parseFloat(array[i].meta).toFixed(1))
            this.metaFormatada.push(array[i].meta_formatada)

            this.valoresVoce.push(parseFloat(array[i].m0).toFixed(1))
            this.voceFormatada.push(array[i].m0_formatada)

            this.valoresPrimeiro.push(parseFloat(array[i].top1).toFixed(1))
            this.primeiroFormatada.push(array[i].top1_formatada)

            this.todosTitulos.push(array[i].titulo)
          }

          // Gerar dados de teste
          // for(let i = 0; i < 3; i++){
          //   this.valoresMeta.push(Math.round(Math.random() * 100))
          //   this.valoresVoce.push(Math.round(Math.random() * 100))
          //   this.valoresPrimeiro.push(Math.round(Math.random() * 100))
          //   this.todosTitulos.push('Teste_' + i)
          // }

          this.criaGrafico()
        }else{
          // não há registros
          console.log('Não há registros')
        }
      },
      alterarPosicao(){
        this.mudarClasse = !this.mudarClasse

        this.posicaoPadraoKPI = !this.posicaoPadraoKPI
        if(this.posicaoPadraoKPI){
          top.postMessage('padrao', this.getBaseUrlApi())
          this.tituloFlecha = 'Subir GAMEK Minificado'
        }else{
          top.postMessage('nPadrao', this.getBaseUrlApi())
          this.tituloFlecha = 'Descer GAMEK Minificado'
        }
      },
      fecharGamek(){
        top.postMessage('gamekFechado', this.getBaseUrlApi())
      }
    },
    mounted(){
      this.requisicaoOpe()
      this.requisicaoMensagens()
      setInterval(() => { this.requisicaoMensagens() }, this.intervaloReqMsg)
    },
  })
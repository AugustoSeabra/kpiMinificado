  let vm = new Vue({
    el: '#container-simplificacao',
    data(){
      return{
        estadoModal: false,
        svgAvatar: '',
        dadosTabelaDestaqueS: [],
        dadosTabelaDestaqueN: [],
        valoresMeta: [],
        valoresVoce: [],
        valoresPrimeiro: [],
        todosTitulos: [],
        titulo: '',
        arrMensagens: [],
        haMensagens: false,
      }
    },
    methods: {
      toggleModal() {
        if(this.estadoModal == false){
          this.anima('abrir')
          this.estadoModal = true
          top.postMessage('abrir', this.getBaseUrlApi())
        }else{
          this.anima('fechar')
          this.estadoModal = false
          top.postMessage('fechar', this.getBaseUrlApi())
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
            
            if(!this.verificaGrafVazio(this.dadosTabelaDestaqueS)){
              this.titulo = 'Principais KPIs'
              this.filtraValores(this.dadosTabelaDestaqueS)
            }else{
              this.titulo = "KPIs"
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
            this.arrMensagens = response.mensagens
            this.haMensagens = true
          }else{
            // console.log('Requisição Mensagem Status NOK: ', response)
            this.haMensagens = false
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

        let altura = this.ajustaAltura()

        var options = {
          series: [{name: 'Meta', data: this.valoresMeta}, {name: 'Você', data: this.valoresVoce}, {name: '1º Colocado', data: this.valoresPrimeiro}],
          colors: ['#0367A6', '#FB8C00', '#009921'],
          // colors: ["#CCC", "#555", "#AAA"],
          chart: {
            width: '100%',
            height: altura,
            type: 'bar',
            stacked: true,
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
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
          yaxis: {
            title: {
              text: undefined,
            },
          },
          xaxis: {
            categories: this.todosTitulos,
            labels: {
              show: false
            }
          },
        };

        var chart = new ApexCharts(document.querySelector('#graficos'), options);
        chart.render();

        this.cont = 1
      },
      ajustaAltura(){
        if(this.valoresMeta.length == 1){
          return '155px'
        }else if(this.valoresMeta.length == 2){
          return '240px'
        }else{
          return '100%'
        }
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
            this.valoresVoce.push(parseFloat(array[i].m0).toFixed(1))
            this.valoresPrimeiro.push(parseFloat(array[i].top1).toFixed(1))
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
      // setSeta(seta){
      //   switch(seta){
      //     case 'up':
      //       return '<i class="fas fa-sort-up"></i>';
      //     case 'down':
      //       return '<i class="fas fa-sort-down"></i>';
      //     case 'mesmo':
      //       return '<i class="fas fa-sort-up"></i>';
      //     default:
      //       return '';
      //   }
      // }
    },
    mounted(){
      this.requisicaoOpe()
      this.requisicaoMensagens()
      setInterval(() => { this.requisicaoMensagens() }, 60000)
    },
  })
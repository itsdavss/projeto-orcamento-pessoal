class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }
        return true
    }
}

class Bd {

    //lógica para construir o ID(com o valor de 0) caso ele ainda não exista
    constructor(){
        let id = localStorage.getItem('id')

        if (id === null){
            localStorage.setItem('id', 0)
        }
    }

    //criando o próximo ID (ou seja, pegando o atual e adicionando +1 ao valor)
    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d){
        let id = this.getProximoId()

        //adicionando a nova despesa //passando os dados de Objetos Literais para formato JSON
        localStorage.setItem(id, JSON.stringify(d))

        //adicionando +1 ao valor do ID para usar como parâmetro na próxima despesa
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){

        //array de despesas
        let despesas = Array()

        let id = localStorage.getItem('id')

        //recuperar todas as despesas cadastradas em localStorage
        for(let i = 1; i <= id; i++){

            //recuperar despesa //passando os dados de formato JSON para Objetos Literais
            let despesa = JSON.parse(localStorage.getItem(i))

            //existe a possibilidade de haver índices que foram pulados/removidos
            //nestes casos nós vamos pular esses índices
            if(despesa === null){
                continue
            }

            despesa.id = i
            //passando as despesas para o array "despesas"
            despesas.push(despesa)

        }

        return despesas
    }

    pesquisar(despesa){
        
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()
		console.log(despesa)
        console.log(despesasFiltradas)

        //ano
        if(despesa.ano != ''){
            console.log('filtro de ano');
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        //mes
        if(despesa.mes != ''){
            console.log('filtro de mes');
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        //dia
        if(despesa.dia != ''){
            console.log('filtro de dia');
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //tipo
        if(despesa.tipo != ''){
            console.log('filtro de tipo');
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        } 

        //valor
        if(despesa.valor != ''){
            console.log('filtro de valor');
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }

}

let bd = new Bd()

function cadastrarDespesa(){
    
    let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value,
		valor.value
    )
        
    if(despesa.validarDados()){

        bd.gravar(despesa)

        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('modal_botao').innerHTML = 'Voltar'
        document.getElementById('modal_body').innerHTML = 'Despesa foi cadastrada com sucesso'
        document.getElementById('modal_botao').className = 'btn btn-success'
        
        $('#Gravacao').modal('show')
        
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
        
    }else{

        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
        document.getElementById('modal_botao').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_body').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos novamente!'
        document.getElementById('modal_botao').className = 'btn btn-danger'

        $('#Gravacao').modal('show')

    }
}

function carregaListaDespesas(despesas = Array(), filtro = false){

    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros()
    }

    //selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    /*
    <tr>
        <td>13/07/2023</td>
        <td>Alimentação</td>
        <td>Compras do mês</td>
        <td>892.32</td>
    </tr>
    */

    //percorrer o array despesas, listando cada despesa de forma dinâmica
    despesas.forEach(function(d){

        //criando a linha (tr)
        let linha = listaDespesas.insertRow()

        //ajustar o tipo
        switch(parseInt(d.tipo)){
            case 1: d.tipo = 'Alimentação'
                break
            case 2: d.tipo = 'Educação'
                break
            case 3: d.tipo = 'Lazer'
                break
            case 4: d.tipo = 'Saúde'
                break
            case 5: d.tipo = 'Transporte'
                break
        }

        //criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criar botão de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            //função para remover a despesa

            //formatando o nome do ID para passar como parâmetro
            let id = this.id.replace('id_despesa_', '')
            //alert(id)
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)

    })
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)
    
    carregaListaDespesas(despesas, true)

}

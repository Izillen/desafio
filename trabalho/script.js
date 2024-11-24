$(function () {
    $("#avaliar").click(function () {
      const senha = $("#senha").val();
      const resultado = avaliarSenha(senha);
      $("#resultado").text(`Força da Senha: ${resultado.avaliacao}`);
    });
  
    function avaliarSenha(senha) {
      let pontuacao = 0;
      let regrasExtras = 0;
  
      const tamanho = senha.length;
      const maiusculas = (senha.match(/[A-Z]/g) || []).length;
      const minusculas = (senha.match(/[a-z]/g) || []).length;
      const numeros = (senha.match(/\d/g) || []).length;
      const simbolos = (senha.match(/[^a-zA-Z\d]/g) || []).length;
      const meio = (senha.slice(1, -1).match(/[^a-zA-Z]/g) || []).length;
  
      pontuacao += tamanho * 4;
      pontuacao += (tamanho - maiusculas) * 2;
      pontuacao += (tamanho - minusculas) * 2;
      pontuacao += numeros * 4;
      pontuacao += simbolos * 6;
      pontuacao += meio * 2;
  
      if (tamanho >= 8) regrasExtras++;
      if (maiusculas > 0) regrasExtras++;
      if (minusculas > 0) regrasExtras++;
      if (numeros > 0 || simbolos > 0) regrasExtras++;
      pontuacao += regrasExtras * 2;
  
      if (/^[a-zA-Z]+$/.test(senha)) pontuacao -= tamanho;
      if (/^\d+$/.test(senha)) pontuacao -= numeros;
  
      const repetidos = senha
        .toLowerCase()
        .split("")
        .filter((c, i, arr) => arr.indexOf(c) !== i).length;
      pontuacao -= repetidos;
  
      pontuacao -= calcularConsecutivos(senha, /[A-Z]/g) * 2;
      pontuacao -= calcularConsecutivos(senha, /[a-z]/g) * 2;
      pontuacao -= calcularConsecutivos(senha, /\d/g) * 2;
  
      pontuacao -= calcularSequencias(senha.toLowerCase(), "abcdefghijklmnopqrstuvwxyz");
      pontuacao -= calcularSequencias(senha, "0123456789");
      pontuacao -= calcularSequencias(senha, "!@#$%^&*()-_=+");
  
      const avaliacao = avaliarPontuacao(pontuacao);
      return { pontuacao, avaliacao };
    }
  
    function calcularConsecutivos(senha, regex) {
      const matches = senha.match(regex) || [];
      let consecutivos = 0;
      for (let i = 0; i < matches.length - 1; i++) {
        if (senha.indexOf(matches[i] + matches[i + 1]) !== -1) consecutivos++;
      }
      return consecutivos;
    }
  
    function calcularSequencias(senha, referencia) {
      let sequencias = 0;
      for (let i = 0; i < senha.length - 2; i++) {
        const segmento = senha.slice(i, i + 3);
        if (referencia.includes(segmento)) sequencias++;
      }
      return sequencias * 3;
    }
  
    function avaliarPontuacao(pontuacao) {
      if (pontuacao < 20) return "Muito fraca";
      if (pontuacao < 40) return "Fraca";
      if (pontuacao < 60) return "Boa";
      if (pontuacao < 80) return "Forte";
      return "Muito forte";
    }
  });
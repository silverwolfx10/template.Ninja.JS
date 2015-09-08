/**
 * $template
 * 
 * Micro template com recursos do puro do javascript a funcao curry e
 * com memoizacao para evitar processamento repitidos
 * 
 * @module $template
 * @author Cleber de Moraes Gonçalves <cleber.programmer>
 * @example
 * 
 *        <script type="text/html" id="user_tmplate">
 *          <% while (users.hasNext()) { %>
 *            <li>
 *              <a href="<%= users.next().url %>"><%= users.current().name %></a>
 *            </li>
 *          <% } %>
 *        </script>
 * 
 */
this.Ninja.module('$template', [
  
  '$concat',
  '$curry',
  '$format',
  '$join',
  '$lambda',
  '$memoize',
  '$reduce',
  '$replace',
  '$split'

], function ($concat, $curry, $format, $join, $lambda, $memoize, $reduce, $replace, $split, _) {
  
  /**
   * Hash de modulos que seram acessados dentro do template
   * pelos seus nomes pre definidos
   */
  var sandbox = {};
  
  /**
   * Passos para a execucao do template, esses passos
   * podem ser configurados adicionando ou removento e ate mesmo
   * alterando a ordem das execucoes, possibilitando novas funcionalidades
   * sem alteracoes no codigo
   */
  var steps = [
    $replace(_, /[\r\t\n]/g, " "),
    $split(_, "<%"),
    $join(_, "\t"),
    $replace(_, /\t=(.*?)%>/g, "', $1,'"),
    $split(_, "\t"),
    $join(_, "');"),
    $split(_, "%>"),
    $join(_, "p.push('"),
    $concat([]),
    $format("var p = []; with($x) { p.push('{0}'); } return p.join('')")
  ];
  
  /**
   * Como um Template Method para criacao da funcao que
   * aplica os dados no template
   * 
   * @private
   * @method exec
   * @param {String} a Html com marcacoes
   * @return {Function} Funcao que aplica os dados no html
   * @example
   * 
   *        exec('<a href="<%= users.next().url %>"><%= users.current().name %></a>');
   * 
   */
  var exec = $memoize(function (a) {
    return Function('$x', '$sandbox', $reduce(steps, a, $lambda('(a, b) => b(a)')));
  });
  
  /**
   * Micro template com recursos do puro do javascript a funcao curry e
   * com memoizacao para evitar processamento repitidos
   * 
   * @public
   * @method template
   * @param {String} a Html com marcacoes
   * @param {Array|Boolean|Date|Funcation|Null|Object|String|Undefined} b Item que o template utiliza para aplicar os dados no template
   * @return {String} Html formatado
   * @example
   * 
   *        <script type="text/html" id="user_tmplate">
   *          <% while (users.hasNext()) { %>
   *            <li>
   *              <a href="<%= users.next().url %>"><%= users.current().name %></a>
   *            </li>
   *          <% } %>
   *        </script>
   * 
   */
  function template(a, b) {
    return exec(a || '')(b, sandbox);
  }

  /**
   * Revelacao do servico $template, encapsulando a visibilidade das funcoes
   * privadas
   */
  return (function (constructor) {
    
    /**
     * Registra modulos para serem acessados dentro do template
     * 
     * @static
     * @method push
     * @param {String} a Nome do modulo para referencia dentro do template
     * @param {Object} b Modulo
     * @example
     * 
     *        $template.push('$pallete', $pallete);
     *
     */
    constructor.push = function (a, b) {
      sandbox[a] = b;
    };
    
    /**
     * Retorna o construtor interceptor a funcao curry com
     * a funcao statica push
     */
    return constructor;
    
  })($curry(template));
  
});

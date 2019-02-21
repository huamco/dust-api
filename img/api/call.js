// 싱글톤으로 만들기 위한 시작점
var singleton = function singleton() {

  this.dataReceived =  function(data) {
  }

}

singleton.instance = null;

singleton.getInstance = function() {
    // 만약 객체가 생성되어 있지 않다면 생성해서 넘겨 주고 생성되어 있다면
    // 기존 객체를 넘겨 준다.
    if(this.instance === null) this.instance = new singleton();
    return this.instance;
}

module.exports = singleton.getInstance();

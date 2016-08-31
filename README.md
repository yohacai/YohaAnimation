Description:
			一款轻量级js高性能dom动画库，原生js编写。
			对浏览器重绘以及回流做了很多优化，保证了dom操作的高性能。
			动画很流畅，并发动画表现很好，兼容ie6+。
使用方法:
      参数:
          element : dom节点
          targetStyle: dom的动画结束状态  
                       例如，{ left:'100px',width:'100px',opacity:'0.5',scrollTop:1000}，其它可自由发挥
          duration: 动画持续时长，毫秒单位, 如 1000
          callback: 动画结束的回调函数，可用于做连续动画。
      API：
		  Yoha.aniamte(element,targetStyle,duration).done(callback);
		  Yoha.show(element, duration)
		  Yoha.hide(element, duration)
		  Yoha.slideDown(element, duration)
		  Yoha.slideUp(element, duration)
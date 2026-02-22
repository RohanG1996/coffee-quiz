(function () {
  if (customElements.get("coffee-quiz")) return;

  class CoffeeQuiz extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" });

      const style = document.createElement("style");
      style.textContent = `
        :host { display: block; width: 100%; }
        iframe { width: 100%; border: none; display: block; }
      `;

      const iframe = document.createElement("iframe");
      const base =
        this.getAttribute("src") || "https://coffee-quiz2.vercel.app";
      iframe.src = base + "/?embed=true";
      iframe.style.minHeight = "600px";
      iframe.title = "What's Your Coffee Personality? | Basecamp Coffee";
      iframe.setAttribute("scrolling", "no");

      window.addEventListener("message", (event) => {
        if (event.data?.type === "coffee-quiz-height") {
          iframe.style.height = event.data.height + "px";
        }
      });

      shadow.appendChild(style);
      shadow.appendChild(iframe);
    }
  }

  customElements.define("coffee-quiz", CoffeeQuiz);
})();

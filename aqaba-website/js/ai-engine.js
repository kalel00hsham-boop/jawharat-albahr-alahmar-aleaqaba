// ===== REAL AI RESPONSE ENGINE (Global) =====
// This logic connects to an open-source unauthenticated LLM (text.pollinations.ai)
// and handles queries about Aqaba or anything else.

async function getAIResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();
    
    // Basic instant greetings
    const greetings = ["مرحبا", "السلام عليكم", "اهلا", "أهلا", "كيف الحال"];
    if (greetings.includes(msg)) {
      return "أهلاً بك! 👋 أنا مساعدك الذكي المفتوح المصدر. اسألني عن العقبة أو أي موضوع آخر وسأجيبك فوراً!";
    }
  
    // Prepare prompt to guide the AI
    const systemPrompt = "أنت مساعد ذكي ولطيف لمدينة العقبة فقط. مهمتك الصارمة هي إجابة أسئلة المستخدم المختصة بمدينة العقبة السياحية وجغرافيتها وتاريخها وأماكنها فقط. إذا سألك المستخدم عن أي موضوع خارج مدينة العقبة، اعتذر بلطف وأخبره أنك مبرمج للإجابة عن أسئلة العقبة فقط. السؤال هو: ";
    const fullPrompt = systemPrompt + userMessage;
  
    // Use a public free endpoint (Pollinations.ai gives text generation without API Key)
    try {
      const response = await fetch('https://text.pollinations.ai/' + encodeURIComponent(fullPrompt));
      if (!response.ok) throw new Error('API Error');
      
      let textResult = await response.text();
      
      // Basic Markdown to HTML formatting (Bold and new lines)
      textResult = textResult.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      textResult = textResult.replace(/\n/g, '<br>');
      
      return textResult;
    } catch (error) {
      console.error("AI Error:", error);
      return "عذراً، يبدو أن هناك مشكلة في الاتصال بخادم الذكاء الاصطناعي حالياً. يرجى إعادة المحاولة لاحقاً.";
    }
  }

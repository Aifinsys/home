document.addEventListener('DOMContentLoaded', function () {
    const startQuizButton = document.getElementById('startQuiz');
    const quizContainer = document.getElementById('quizContainer');
    const questionCount = document.getElementById('questionCount'); // 新增
    const questionNumber = document.getElementById('questionNumber');
    const questionText = document.getElementById('questionText');
    const options = document.getElementById('options');
    const answerInput = document.getElementById('answerInput');
    const submitAnswerButton = document.getElementById('submitAnswer');
    const result = document.getElementById('result');
    const explanation = document.getElementById('explanation');

    let questions = [];
    let currentQuestionIndex = 0;
    let selectedQuestions = [];

    if (startQuizButton) {
        startQuizButton.addEventListener('click', function () {
            window.location.href = 'quiz.html';
        });
    }

    if (quizContainer) {
        fetch('20.json')
            .then(response => response.json())
            .then(data => {
                questions = data;
                selectedQuestions = getRandomQuestions(questions, 5);
                displayQuestion();
            });

        submitAnswerButton.addEventListener('click', function () {
            const userAnswer = answerInput.value.trim();
            const correctAnswer = selectedQuestions[currentQuestionIndex].答案.toString();

            if (userAnswer === correctAnswer) {
                result.innerHTML = '&#10004;'; // 藍色圓圈
                result.style.color = 'blue';
                setTimeout(nextQuestion, 1000);
            } else {
                result.innerHTML = '&#10008;'; // 紅色打叉
                result.style.color = 'red';
                explanation.innerHTML = `答案: ${correctAnswer}<br>解析: ${selectedQuestions[currentQuestionIndex].解析}`;
                setTimeout(nextQuestion, 10000);
            }
        });
    }

    function getRandomQuestions(questions, count) {
        const shuffled = questions.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function displayQuestion() {
        const question = selectedQuestions[currentQuestionIndex];
        questionCount.textContent = `${currentQuestionIndex + 1}/5 題`; // 顯示當前題數
        questionNumber.textContent = `題號: ${question.題號}`;
        questionText.textContent = question.題目;
        options.innerHTML = `
            <p>1. ${question.選項1}</p>
            <p>2. ${question.選項2}</p>
            <p>3. ${question.選項3}</p>
            <p>4. ${question.選項4}</p>
        `;
        quizContainer.style.display = 'block';
        answerInput.value = '';
        result.innerHTML = '';
        explanation.innerHTML = '';
    }

    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < selectedQuestions.length) {
            displayQuestion();
        } else {
            result.innerHTML = 'OK';
            result.style.color = 'green';
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
    }
});
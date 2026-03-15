import { commandDatabase } from './commandDatabase.js';

export class QuizSystem {
    constructor(questionId, optionsId, currentScoreId, resultId, finalScoreId, restartBtnId, currentQIndexId) {
        this.questionArea = document.getElementById(questionId);
        this.optionsArea = document.getElementById(optionsId);
        this.currentScoreElement = document.getElementById(currentScoreId);
        this.resultArea = document.getElementById(resultId);
        this.finalScoreElement = document.getElementById(finalScoreId);
        this.restartBtn = document.getElementById(restartBtnId);
        this.currentQIndexElement = document.getElementById(currentQIndexId);

        this.currentScore = 0;
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.totalQuestions = 10;

        this.restartBtn.addEventListener('click', () => this.reset());
    }

    generateQuestions() {
        const shuffled = [...commandDatabase].sort(() => 0.5 - Math.random());
        this.questions = shuffled.slice(0, this.totalQuestions).map(cmd => {
            const questionType = Math.floor(Math.random() * 3);
            let questionText, answer, options;

            const wrongOptionsBase = commandDatabase.filter(c => c.name !== cmd.name);
            const wrongOptions = wrongOptionsBase.sort(() => 0.5 - Math.random()).slice(0, 3);

            if (questionType === 0) {
                // Type 0: Purpose -> Name
                questionText = `Which command is used to ${cmd.description.toLowerCase().replace(/\.$/, '')}?`;
                answer = cmd.name;
                options = [...wrongOptions.map(o => o.name), cmd.name];
            } else if (questionType === 1) {
                // Type 1: Name -> Purpose
                questionText = `What is the primary purpose of the '${cmd.name}' command?`;
                answer = cmd.description;
                options = [...wrongOptions.map(o => o.description), cmd.description];
            } else {
                // Type 2: Windows -> Linux/Mac (or vice versa)
                const isWindows = Math.random() > 0.5;
                if (isWindows) {
                    questionText = `What is the Linux/macOS equivalent of the Windows '${cmd.commands.windows}' command?`;
                    answer = cmd.commands.linux;
                    options = [...wrongOptions.map(o => o.commands.linux), cmd.commands.linux];
                } else {
                    questionText = `What is the Windows equivalent of the Linux '${cmd.commands.linux}' command?`;
                    answer = cmd.commands.windows;
                    options = [...wrongOptions.map(o => o.commands.windows), cmd.commands.windows];
                }
            }
            
            // Remove duplicates and shuffle options
            const uniqueOptions = [...new Set(options)].sort(() => 0.5 - Math.random());
            
            // If we lost options due to duplicates, fill back up
            while (uniqueOptions.length < 4) {
                const extra = wrongOptionsBase[Math.floor(Math.random() * wrongOptionsBase.length)];
                const val = questionType === 0 ? extra.name : (questionType === 1 ? extra.description : extra.commands.linux);
                if (!uniqueOptions.includes(val)) uniqueOptions.push(val);
            }

            return {
                question: questionText,
                answer: answer,
                options: uniqueOptions.sort(() => 0.5 - Math.random())
            };
        });
    }

    start() {
        this.currentScore = 0;
        this.currentQuestionIndex = 0;
        this.currentScoreElement.textContent = '0';
        if (this.currentQIndexElement) this.currentQIndexElement.textContent = '1';
        this.resultArea.classList.add('hidden');
        document.getElementById('quiz-question-area').classList.remove('hidden');
        this.generateQuestions();
        this.loadQuestion();
    }

    loadQuestion() {
        const q = this.questions[this.currentQuestionIndex];
        this.questionArea.textContent = q.question;
        this.optionsArea.innerHTML = '';
        if (this.currentQIndexElement) this.currentQIndexElement.textContent = (this.currentQuestionIndex + 1).toString();

        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.onclick = () => this.checkAnswer(opt, btn);
            this.optionsArea.appendChild(btn);
        });
    }

    checkAnswer(selected, button) {
        const q = this.questions[this.currentQuestionIndex];
        const allButtons = this.optionsArea.querySelectorAll('.quiz-option');
        
        allButtons.forEach(b => b.disabled = true);

        if (selected === q.answer) {
            button.classList.add('correct');
            this.currentScore += 10;
            this.currentScoreElement.textContent = this.currentScore;
        } else {
            button.classList.add('wrong');
            allButtons.forEach(b => {
                if (b.textContent === q.answer) b.classList.add('correct');
            });
        }

        setTimeout(() => {
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex < this.questions.length) {
                this.loadQuestion();
            } else {
                this.showResults();
            }
        }, 1200);
    }

    showResults() {
        document.getElementById('quiz-question-area').classList.add('hidden');
        this.resultArea.classList.remove('hidden');
        this.finalScoreElement.textContent = this.currentScore;
    }

    reset() {
        this.start();
    }
}

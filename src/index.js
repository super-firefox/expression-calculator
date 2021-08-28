function eval() {
    // Do not use eval!!!
    return;
}

class Calculator {
    constructor(expresion) {
        this.exp = expresion;
    }

    isPairBreckets () {
        const mapBreckets = new Map([['(', 0], [')', 0]]);
        for(let char of this.exp) {
            if(mapBreckets.has(char)){
                mapBreckets.set(char, mapBreckets.get(char)+1)
            }
        }
        return mapBreckets.get('(') === mapBreckets.get(')')
    }

    createArrayExpr() {
        if(!this.isPairBreckets()){
            throw new Error('ExpressionError: Brackets must be paired');
        }

        let array = Array.from(this.exp).filter((item) => item !== ' ' );
        let acum = '';
        let result = []
        for(let item of array){
            if(['+', '-', '*', '/', '(', ')'].includes(item)){
                if(acum !== ''){
                    //! fix minus operator
                    if(result.slice(-1)[0] === '-'){
                        result.pop();
                        result.push('+')
                        result.push(-1 * acum);
                    } else {
                        result.push(+acum)
                    }
                }
                result.push(item);
                acum = '';
                // ------------------
                    // if (acum !== '') result.push(+acum);
                    // result.push(item);
                    // acum = '';
                //-------------------
            } else {
                acum += item;
            }
        }
        if(acum !== '') result.push(+acum);
        return result;
    }

    getPriorityOPerator(operator){
        switch(operator) {
            case '*':
            case '/':
                return 2;
            case '+':
            case '-':
                return 1;
            default:
                return 0;
        }
    }

    isOperator(item) {
        return ['+', '-', '*', '/', '(', ')'].includes(item);
    }

    action(a, b, operator) {
        switch (operator) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '/':
                if(b === 0){
                    throw new Error('TypeError: Division by zero.');
                }
                // console.log(parseFloat((a / b).toFixed(4)));
                return a / b;
        }
    }

    calc() {
        let expArr = this.createArrayExpr();
        let notation = this.shutingYard(expArr);
        // console.log(notation); 
        let indexOperator;
        let a, b, operator;
        while(notation.length != 1){
            indexOperator = notation.findIndex(item => this.isOperator(item));
            a = notation[indexOperator-2];
            b = notation[indexOperator-1];
            operator = notation[indexOperator];
            // console.log(this.action(a, b, operator))
            // console.log(notation[indexOperator+1] === '-')
            // if(notation[indexOperator+1] === '-') operator = '+'
            notation.splice(indexOperator-2, 3, this.action(a, b, operator));
            // console.log(notation); 
        }
        return notation[0];
    }

    shutingYard(expArray){
        let elem;
        let stack = [];
        let notation = [];
        const LEN = expArray.length;

        for(let i = 0; i < LEN; i++) {
            elem = expArray[i];
            if(!this.isOperator(elem)){
                notation.push(elem);
            } else {
                if(elem === ')') {
                    let itemOperator
                    while(true){
                        itemOperator = stack.pop();
                        if(itemOperator === '(') {
                            break;
                        }
                        notation.push(itemOperator);
                    }
                } else if(
                    stack.length === 0 || 
                    elem === '(' ||
                    this.getPriorityOPerator(elem) > this.getPriorityOPerator(stack[stack.length-1])
                ) {
                    stack.push(elem);
                } else {
                    notation.push(stack.pop());
                    stack.push(elem);
                }
            }
        }
        notation.push(...stack.reverse());
        return notation;
    }
    

}

function expressionCalculator(expr) {
    // write your solution here
    return new Calculator(expr).calc();
}

module.exports = {
    expressionCalculator
}
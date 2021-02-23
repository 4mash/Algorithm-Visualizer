const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const sortButton = document.getElementById("sort");
const shuffleButton = document.getElementById("shuffle");
const algorithmSelect = document.getElementById("algorithm");
const stopButton = document.getElementById("stop");
const sizeInput = document.getElementById("elements");
const speedSlider = document.getElementById("speed");
const computeLabel = document.getElementById("compute-time");

let nums;
let start, end;
let algorithmRunning = false;
ctx.canvas.width  = window.innerWidth*0.965;
ctx.canvas.height = window.innerHeight*0.5;
generateArray(sizeInput.value);
draw();

async function shuffle(array)
{
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex)
    {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        await sleep(200-speedSlider.value, currentIndex, randomIndex);
    }
    draw();
}

function sleep(ms, x, y)
{
    return new Promise(resolve => setTimeout(() => resolve(draw(x, y)), ms));
}

function generateArray(size)
{
    nums = [];
    for (let i = 1; i <= size; i++)
    {
        nums.push(i/size);
    }
}

function draw(index1, index2)
{
    ctx.clearRect(0,0, canvas.clientWidth, canvas.clientHeight);
    let x = (canvas.width/nums.length)/2;
    for (let i = 0; i < nums.length; i++)
    {
        if (index1 === i || index2 === i) ctx.strokeStyle = 'red';
        else ctx.strokeStyle = 'white';
        ctx.lineWidth = (canvas.width-300)/nums.length;
        ctx.beginPath();
        ctx.moveTo(x, canvas.clientHeight);
        ctx.lineTo(x, canvas.clientHeight - (nums[i]*canvas.clientHeight));
        ctx.stroke();
        x += (canvas.width/nums.length);
    }
}

async function selectionSort()
{
    for (let x = 0; x < nums.length; x++)
    {
        for (let y = 0; y < nums.length; y++)
        {
            if (algorithmRunning === false) return;
            if (nums[x] < nums[y])
            {
                const t = nums[x];
                nums[x] = nums[y];
                nums[y] = t;
            }
            await sleep(200-speedSlider.value, x,y);
        }
    }
}

async function selectionSortOptimized()
{
    for (let x = 0; x < nums.length; x++)
    {
        for (let y = x+1; y < nums.length; y++)
        {
            if (algorithmRunning === false) return;
            if (nums[x] > nums[y])
            {
                const t = nums[x];
                nums[x] = nums[y];
                nums[y] = t;
            }
            await sleep(200-speedSlider.value, x,y);
        }
    }
}

async function insertionSort()
{
    let i, key, j;
    for (i = 1; i < nums.length; i++)
    {
        key = nums[i];
        j = i - 1;
        while (j >= 0 && nums[j] > key)
        {
            if (algorithmRunning === false) return;
            nums[j + 1] = nums[j];
            j = j - 1;
            await sleep(200-speedSlider.value, j, i);
        }
        nums[j + 1] = key;
    }
}

function swap(leftIndex, rightIndex)
{
    let temp = nums[leftIndex];
    nums[leftIndex] = nums[rightIndex];
    nums[rightIndex] = temp;
}
async function partition(left, right)
{
    let pivot   = nums[Math.floor((right + left) / 2)],
        i       = left,
        j       = right;
    while (i <= j)
    {
        while (nums[i] < pivot)
        {
            i++;
            await sleep(200 - speedSlider.value, i,j);
        }

        while (nums[j] > pivot)
        {
            j--;
            await sleep(200 - speedSlider.value, i,j);
        }

        if (i <= j)
        {
            swap(i, j);
            i++;
            j--;
            await sleep(200 - speedSlider.value, i,j);
        }
        if (algorithmRunning === false) return;
    }
    return i;
}

async function quickSort(left, right)
{
    let index;
    if (nums.length > 1)
    {
        index = await partition(left, right);
        if (left < index - 1)
            await quickSort(left, index - 1);
        if (index < right)
            await quickSort(index, right);
    }
}

async function bubbleSort()
{
    for (let x = 0; x < nums.length-1; x++)
        for (let y = 0; y < nums.length-x-1; y++)
        {
            if (algorithmRunning === false) return;
            if (nums[y] > nums[y+1])
            {
                const t = nums[y+1];
                nums[y+1] = nums[y];
                nums[y] = t;
            }
            await sleep(200 - speedSlider.value, x,y);
        }
}

async function countingSort()
{
    let i
    let z = 0
    const count = []
    let array = [];
    for (const a of nums)
        array.push(Math.fround(a*sizeInput.value));

    let max = array[array.length-1];
    let min = array[0];

    for (let i = 0; i < array.length; i++)
    {
        if (max < array[i]) max = array[i];
        if (min > array[i]) min = array[i];
        await sleep(200 - speedSlider.value, i);
        if (algorithmRunning === false) return;
    }

    for (i = min; i <= max; i++)
    {
        count[i] = 0
        await sleep(200 - speedSlider.value, i);
        if (algorithmRunning === false) return;
    }

    for (i=0; i < array.length; i++)
    {
        count[array[i]]++
        await sleep(200 - speedSlider.value, i, array[i]);
        if (algorithmRunning === false) return;
    }

    for (i = min; i <= max; i++)
    {
        while (count[i]-- > 0)
        {
            array[z++] = i
            await sleep(200 - speedSlider.value, i,z);
            if (algorithmRunning === false) return;
        }
    }

    for (let i = 0; i < nums.length; i++)
    {
        nums[i] = array[i]/sizeInput.value;
        await sleep(200 - speedSlider.value, i);
        if (algorithmRunning === false) return;
    }
}

sortButton.addEventListener("click", async () => {
    if (algorithmRunning === false)
    {
        start = new Date();
        algorithmRunning = true;
        switch (Number(algorithmSelect.value))
        {
            case 0: await selectionSort(); break;
            case 1: await selectionSortOptimized(); break;
            case 2: await insertionSort(); break;
            case 3: await quickSort(0, nums.length-1); break;
            case 4: await bubbleSort(); break;
            case 5: await countingSort(); break;
        }
        end = new Date();
        computeLabel.innerHTML = "Completed in " + (end-start)/1000 + " second(s)";
        algorithmRunning = false;
        draw();
    }
});

shuffleButton.addEventListener("click", async () =>{
    if (algorithmRunning === false)
    {
        generateArray(sizeInput.value);
        await shuffle(nums);
    }

});

stopButton.addEventListener("click", () => {
    algorithmRunning = false;
});

//----------------------------------------------------------------------------------------------------------------------
/*function generateArrayColorful(size)
{
    let red = new rgb(255,0,0), green = new rgb(0,255,0), blue = new rgb(0,0,255);
    let current = new rgb(0,0,0);
    const f = 10/size;
    for (let i = 1; i <= size; i++)
    {
        let r,g,b;
        if (i < size * 0.33)
        {
            r = lerp(current.r, red.r, f);
            g = lerp(current.g, red.g, f);
            b = lerp(current.b, red.b, f);
        }
        else if (i >= size * 0.33 && i <= size * 0.66)
        {
            r = lerp(current.r, green.r, f);
            g = lerp(current.g, green.g, f);
            b = lerp(current.b, green.b, f);
        }
        else
        {
            r = lerp(current.r, blue.r, f);
            g = lerp(current.g, blue.g, f);
            b = lerp(current.b, blue.b, f);
        }
        nums.push(new Element(i/size, 'rgb(' + r + ',' + g + ',' + b + ")"));
        current.r = r;
        current.g = g;
        current.b = b;
    }
}*/

function lerp(a, b, f)
{
    return (a * (1.0 - f)) + (b * f);
}

function range(i, min, max)
{
    return (i - min) / (max - min);
}
class ContinuousCarouselController {
    constructor(options) {
        this.gap = options.gap || 115;
        this.itemWidth = options.itemWidth || 155;
        this.speed = options.speed || 1; 
        this.direction = options.direction || 1; 
        this.pauseOnHover = options.pauseOnHover !== false; 

        this.carousel = document.getElementById(options.carouselId);
        this.content = document.getElementById(options.contentId);
        this.next = document.getElementById(options.nextId);
        this.prev = document.getElementById(options.prevId);

        this.isRunning = false;
        this.isPaused = false;
        this.animationFrame = null;
        this.isInitialized = false;
        this.singleSetWidth = 0;
        this.lastTimestamp = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartScrollLeft = 0;
        this.dragVelocity = 0;
        this.lastDragX = 0;
        this.dragMomentum = false;

        this.init();
    }

    init() {
        if (this.isInitialized) return;

        const originalContent = this.content.innerHTML;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalContent;
        const items = Array.from(tempDiv.children);
      
        this.content.innerHTML = originalContent + originalContent + originalContent + originalContent;

        setTimeout(() => {
            this.calculateDimensions();
            this.setupEventListeners();
            this.setupInitialPosition();
            this.isInitialized = true;
            this.start();
        }, 100);
    }

    calculateDimensions() {
        const totalItems = this.content.children.length;
        const originalItemCount = totalItems / 4; 
        this.singleSetWidth = originalItemCount * (this.itemWidth + this.gap);
        
        console.log(`Carousel ${this.carousel.id}: singleSetWidth = ${this.singleSetWidth}, totalItems = ${totalItems}`);
    }

    setupInitialPosition() {
        this.carousel.style.scrollBehavior = 'auto';
        this.carousel.scrollLeft = this.singleSetWidth; 
    }

    setupEventListeners() {
        if (this.pauseOnHover) {
            this.carousel.addEventListener('mouseenter', () => {
                this.pause();
            });

            this.carousel.addEventListener('mouseleave', () => {
                if (!this.isDragging) {
                    this.resume();
                }
            });
        }

        this.carousel.addEventListener('mousedown', (e) => this.startDrag(e));
        this.carousel.addEventListener('mousemove', (e) => this.drag(e));
        this.carousel.addEventListener('mouseup', () => this.endDrag());
        this.carousel.addEventListener('mouseleave', () => this.endDrag());
        this.carousel.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });
        this.carousel.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        this.carousel.addEventListener('touchend', () => this.endDrag());

        if (this.next) {
            this.next.addEventListener("click", (e) => {
                e.preventDefault();
                this.handleNextClick();
            });
        }

        if (this.prev) {
            this.prev.addEventListener("click", (e) => {
                e.preventDefault();
                this.handlePrevClick();
            });
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });

        this.carousel.style.cursor = 'grab';
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.lastTimestamp = performance.now();
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
        if (!this.isRunning) {
            this.start();
        }
    }

    changeDirection(newDirection) {
        this.direction = newDirection;
    }

    changeSpeed(newSpeed) {
        this.speed = Math.max(0.1, Math.min(10, newSpeed)); 
    }

    handleNextClick() {
        this.pause();
        this.smoothScrollBy(this.itemWidth + this.gap);
        setTimeout(() => {
            if (!this.isDragging) this.resume();
        }, 800);
    }

    handlePrevClick() {
        this.pause();
        this.smoothScrollBy(-(this.itemWidth + this.gap));
        setTimeout(() => {
            if (!this.isDragging) this.resume();
        }, 800);
    }

    smoothScrollBy(distance) {
        const startScrollLeft = this.carousel.scrollLeft;
        const targetScrollLeft = startScrollLeft + distance;
        const startTime = performance.now();
        const duration = 600;

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            this.carousel.scrollLeft = startScrollLeft + (distance * easeOut);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    }

    startDrag(e) {
        e.preventDefault();
        
        this.isDragging = true;
        this.dragMomentum = false;
        this.pause();
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        this.dragStartX = clientX;
        this.lastDragX = clientX;
        this.dragStartScrollLeft = this.carousel.scrollLeft;
        this.dragVelocity = 0;
        
        this.carousel.style.cursor = 'grabbing';
        this.carousel.style.userSelect = 'none';
    }

    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault();

        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const deltaX = clientX - this.dragStartX;
        const currentDeltaX = clientX - this.lastDragX;
        this.dragVelocity = currentDeltaX * 0.8 + this.dragVelocity * 0.2;
        this.lastDragX = clientX;
        
        this.carousel.scrollLeft = this.dragStartScrollLeft - deltaX;
    }

    endDrag() {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.carousel.style.cursor = 'grab';
        this.carousel.style.userSelect = '';

        if (Math.abs(this.dragVelocity) > 2) {
            this.applyMomentum();
        } else {
            setTimeout(() => {
                if (!this.isDragging) this.resume();
            }, 300);
        }
    }

    applyMomentum() {
        this.dragMomentum = true;
        let velocity = this.dragVelocity;
        const friction = 0.95;
        const minVelocity = 0.5;

        const momentumStep = () => {
            if (Math.abs(velocity) < minVelocity || !this.dragMomentum) {
                this.dragMomentum = false;
                setTimeout(() => {
                    if (!this.isDragging) this.resume();
                }, 500);
                return;
            }

            this.carousel.scrollLeft -= velocity;
            velocity *= friction;
            
            requestAnimationFrame(momentumStep);
        };

        requestAnimationFrame(momentumStep);
    }

    animate(timestamp = performance.now()) {
        if (!this.isRunning) return;


        const deltaTime = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        if (!this.isPaused && deltaTime > 0 && !this.dragMomentum) {
            const moveDistance = (this.speed * deltaTime) / 16.67; 
            this.carousel.scrollLeft += moveDistance * this.direction;
            this.checkAndResetPosition();
        }

        this.animationFrame = requestAnimationFrame((ts) => this.animate(ts));
    }

    checkAndResetPosition() {
        const currentScroll = this.carousel.scrollLeft;
        
        if (this.direction > 0) {
            if (currentScroll >= this.singleSetWidth * 2) {
                this.carousel.scrollLeft = this.singleSetWidth;
            }
        } else {
            if (currentScroll <= this.singleSetWidth) {
                this.carousel.scrollLeft = this.singleSetWidth * 2;
            }
        }
    }

    destroy() {
        this.stop();
        this.dragMomentum = false;
        this.isDragging = false;
        this.isInitialized = false;
    }
}

let continuousCarouselInstances = {};

function createContinuousCarousel(id, config) {
    if (continuousCarouselInstances[id]) {
        continuousCarouselInstances[id].destroy();
    }

    continuousCarouselInstances[id] = new ContinuousCarouselController(config);
    return continuousCarouselInstances[id];
}


function initializeContinuousCarousels() {
    

    if (document.getElementById('carousel')) {
        createContinuousCarousel('suppliers', {
            carouselId: 'carousel',
            contentId: 'content',
            nextId: 'next',
            prevId: 'prev',
            gap: 115,
            itemWidth: 110,
            speed: 0.5, 
            direction: 1, 
            pauseOnHover: true
        });
    }
}


function setCarouselSpeed(carouselId, speed) {
    const instance = continuousCarouselInstances[carouselId];
    if (instance) {
        instance.changeSpeed(speed);
    }
}

function setCarouselDirection(carouselId, direction) {
    const instance = continuousCarouselInstances[carouselId];
    if (instance) {
        instance.changeDirection(direction);
    }
}

function pauseCarousel(carouselId) {
    const instance = continuousCarouselInstances[carouselId];
    if (instance) {
        instance.pause();
    }
}

function resumeCarousel(carouselId) {
    const instance = continuousCarouselInstances[carouselId];
    if (instance) {
        instance.resume();
    }
}


function pauseAllCarousels() {
    Object.values(continuousCarouselInstances).forEach(instance => {
        instance.pause();
    });
}

function resumeAllCarousels() {
    Object.values(continuousCarouselInstances).forEach(instance => {
        instance.resume();
    });
}


function waitForDOM() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeContinuousCarousels, 500);
        });
    } else {
        setTimeout(initializeContinuousCarousels, 500);
    }
}

window.addEventListener('load', () => {
    setTimeout(() => {
        const activeCarousels = Object.keys(continuousCarouselInstances).length;
        
        if (activeCarousels === 0) {
            initializeContinuousCarousels();
        }
    }, 1000);
});

waitForDOM();

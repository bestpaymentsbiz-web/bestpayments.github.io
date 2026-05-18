// ========================================
// QNA Page Functionality
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // QNA Item Toggle
    const qnaItems = document.querySelectorAll('.qna-item');
    
    qnaItems.forEach(item => {
        const question = item.querySelector('.qna-question');
        
        question.addEventListener('click', function() {
            // Close all other items
            qnaItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Category Filtering
    const categoryTabs = document.querySelectorAll('.category-tab');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter QNA items
            filterQNA(category);
        });
    });

    function filterQNA(category) {
        qnaItems.forEach(item => {
            item.classList.remove('active'); // Close all items
            
            if (category === 'all') {
                item.classList.remove('hidden');
            } else {
                const itemCategory = item.getAttribute('data-category');
                if (itemCategory === category) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
        });

        // Check if there are visible items
        checkEmptyState();
    }

    // Search Functionality
    const searchInput = document.getElementById('qnaSearch');
    let searchTimeout;
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase().trim();
                searchQNA(searchTerm);
            }, 300);
        });
    }

    function searchQNA(searchTerm) {
        if (!searchTerm) {
            // Show all items if search is empty
            qnaItems.forEach(item => {
                item.classList.remove('hidden');
                removeHighlights(item);
            });
            checkEmptyState();
            return;
        }

        let foundCount = 0;

        qnaItems.forEach(item => {
            const question = item.querySelector('.qna-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.qna-answer').textContent.toLowerCase();
            
            removeHighlights(item);
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.classList.remove('hidden');
                highlightText(item, searchTerm);
                foundCount++;
            } else {
                item.classList.add('hidden');
            }
        });

        checkEmptyState();
    }

    function highlightText(item, searchTerm) {
        const question = item.querySelector('.qna-question h3');
        const answerParagraphs = item.querySelectorAll('.qna-answer p, .qna-answer li');
        
        highlightInElement(question, searchTerm);
        answerParagraphs.forEach(p => highlightInElement(p, searchTerm));
    }

    function highlightInElement(element, searchTerm) {
        const originalText = element.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const highlightedText = originalText.replace(regex, '<span class="highlight">$1</span>');
        
        if (originalText !== highlightedText) {
            element.innerHTML = highlightedText;
        }
    }

    function removeHighlights(item) {
        const highlights = item.querySelectorAll('.highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
    }

    function checkEmptyState() {
        const visibleItems = Array.from(qnaItems).filter(item => !item.classList.contains('hidden'));
        const container = document.querySelector('.qna-list .container');
        let emptyState = container.querySelector('.empty-state');
        
        if (visibleItems.length === 0) {
            if (!emptyState) {
                emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.innerHTML = `
                    <i class="fas fa-search"></i>
                    <h3>검색 결과가 없습니다</h3>
                    <p>다른 검색어로 시도해보세요</p>
                `;
                container.appendChild(emptyState);
            }
        } else {
            if (emptyState) {
                emptyState.remove();
            }
        }
    }

    // Open first item by default (optional)
    // if (qnaItems.length > 0) {
    //     qnaItems[0].classList.add('active');
    // }
});
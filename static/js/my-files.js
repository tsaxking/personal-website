const myFilesRow = document.querySelector('#my-files-row');

function getMyFiles() {
    requestFromServer({
        url: '/files/get-all',
        method: 'POST',
        func: (data) => {
            createFilesGraph(data);

            const { files: { libFiles }, total, totalSize, maxSize } = data;
            let ratio = Math.floor((totalSize / maxSize) * 100);
            let percent = Math.floor((totalSize / maxSize) * 100) + '%';
            document.querySelectorAll('.my-files-progress').forEach(pg => {
                pg.setAttribute('aria-valuenow', totalSize);
                pg.setAttribute('aria-valuemin', 0);
                pg.setAttribute('aria-valuemax', maxSize);
                pg.style.width = percent;
            });

            document.querySelectorAll('.my-files-percent').forEach(el => {
                if (ratio > 90) {
                    el.classList.add('text-danger');
                    // el.classList.remove('text-primary');
                } else {
                    // el.classList.add('text-primary');
                    el.classList.remove('text-danger');
                }
                el.innerHTML = percent;
            });

            document.querySelectorAll('.my-files-num').forEach(el => {
                el.innerHTML = `${formatBytes(totalSize)}/${formatBytes(maxSize, 0)}`;
            });

            createLibraryRow(libFiles);
        }
    });
}

function createLibraryRow(libs) {
    let libContainer = document.createElement('div.container-fluid');

    libs.forEach(lib => {
        let libRow = createElementFromSelector('div.row');
        let csvCard = createCsvCard({
            size: lib.libSize,
            src: lib.library,
            filename: lib.name + '.csv'
        }, [
            createButton('<i class="material-icons">file_download</i>', ['bg-maroon', 'text-light'], [{
                type: 'click',
                action: (e) => {
                    fetch('/library/download', {
                            method: 'POST',
                            body: {
                                libraryId: lib.library
                            },
                            headers: {
                                "Content-Type": "application/csv",
                                "Accept": "application/csv"
                            }
                        })
                        .then(resp => {
                            return resp.blob();
                            // resp.json().catch(err => {
                            //     console.error(err);
                            // });
                            // try {
                            //     return resp.json();
                            // } catch (err) {
                            //     return resp.blob();
                            // }
                        })
                        .then(blob => {
                            if (blob.download === false) {
                                const { status, title, msg, url, wait, clearCart, notificationLength } = blob;
                                if (msg) {
                                    createNotification(title, msg, status, notificationLength);
                                }
                                return;
                            }

                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            // the filename you want
                            a.download = lib.name + '.csv';
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            // alert('your file has downloaded!'); // or you know, something with better UX...
                        });
                }
            }])
        ], '.col-sm-6.col-xm-12.col-md-4.col-lg-3.col-xl-2');
        libRow.appendChild(csvCard);

        lib.pieces.forEach(piece => {
            piece.pdf.forEach(pdf => {
                let card = createPdfCard(pdf, [
                    createButton('<i class="material-icons">file_download</i>', ['bg-maroon', 'text-light'], [{
                        type: 'click',
                        action: (e) => {
                            fetch(`http://localhost:3000/static/pdfs/${pdf.src}`)
                                .then(resp => resp.blob())
                                .then(blob => {
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.style.display = 'none';
                                    a.href = url;
                                    // the filename you want
                                    a.download = pdf.filename + '.pdf';
                                    document.body.appendChild(a);
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                    // alert('your file has downloaded!'); // or you know, something with better UX...
                                });
                        }
                    }])
                ], '.col-sm-6.col-xm-12.col-md-4.col-lg-3.col-xl-2');
                libRow.appendChild(card);
            });
        });

        libContainer.appendChild(libRow);
    });

    myFilesRow.appendChild(libContainer);
}




getMyFiles();
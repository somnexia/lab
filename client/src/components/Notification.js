
class Notification extends React.Component {
    state = {}
    render() {
        return (
            <div class="border-bottom border-translucent py-3 notification-card position-relative px-2 px-sm-3">
                <div class="d-flex align-items-center justify-content-between position-relative">
                    <div class="d-flex">
                        <div class="me-3 status-online avatar avatar-m">
                            <img src="" alt="avatar" class="rounded-circle"></img>
                        </div>
                        <div class="flex-1 me-sm-3">
                            <h4 class="fs-9 text-body-emphasis">Jessie Samson</h4>
                            <p class="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal">
                                <span class="me-1 fw-bold fs-10">💬</span>
                                <span>Mentioned you in a comment.</span>
                                <span class="ms-2 text-body-quaternary text-opactity-75 fw-bold fs-10">10m</span>
                            </p>
                            <p class="text-body-secondary fs-9 mb-0">10:41  August 7,2021</p>
                        </div>
                    </div>
                    <div class="d-none d-sm-block dropdown">
                        <button type="button" id="" aria-expanded="false" class="notification-dropdown-toggle btn-reveal dropdown-caret-none transition-none dropdown-toggle btn btn-sm">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis"
                                class="svg-inline--fa fa-ellipsis fs-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path fill="currentColor" d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

        );
    }
}

export default Notification;
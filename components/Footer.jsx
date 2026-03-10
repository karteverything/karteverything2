export default function Footer() {
    const formattedDate = new Date().toString().split(" GMT")[0];

    return (
        <footer className="footer-container">
            <div className="bottom-bar">

                <a href="">
                    &copy; KArt Everything
                </a>

                <p>{formattedDate}</p>
            </div>
        </footer>
    );
}